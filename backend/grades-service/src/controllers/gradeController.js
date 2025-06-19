const XLSX = require('xlsx');
const fs = require('fs');
const pool = require('../db');
// Validate enum-like input
const isValidType = (type) => ['INITIAL', 'FINAL'].includes(type?.toUpperCase());

exports.getAllGrades = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM grade ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
};

exports.getGradeById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM grade WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Grade not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
};

exports.getGradesByStudent = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(`
      SELECT 
        g.id AS grade_id,
        g.value AS grade,
        g.type,
        g.status,
        g.grade_batch_id,
        g.course_id,
        c.title AS course_title,
        c.exam_period AS exam_period,  -- ✅ ΝΕΟ ΠΕΔΙΟ
        g.detailed_grade_json
      FROM grade g
      JOIN course c ON g.course_id = c.id
      WHERE g.user_am = $1
      ORDER BY g.course_id, g.type
    `, [id]);

    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching grades for student:', err);
    res.status(500).json({ error: 'Database error' });
  }
};


exports.getCoursesForInstructor = async (req, res) => {
  const { id } = req.params;

  const query = `
    SELECT 
      c.id,
      c.title AS course_name,
      c.exam_period,
      c.description,
      COALESCE(
        TO_CHAR(MAX(CASE WHEN gb.type = 'INITIAL' THEN gb.uploaded_at END), 'YYYY-MM-DD'),
        '-' 
      ) AS initial_submission,
      COALESCE(
        TO_CHAR(MAX(CASE WHEN gb.type = 'FINAL' THEN gb.uploaded_at END), 'YYYY-MM-DD'),
        '-' 
      ) AS final_submission
    FROM course c
    LEFT JOIN grade_batch gb ON gb.course_id = c.id
    WHERE c.instructor_id = $1
    GROUP BY c.id, c.title, c.exam_period, c.description
    ORDER BY c.title;
  `;

  try {
    const result = await pool.query(query, [id]);
    res.json(result.rows);
  } catch (err) {
    console.error('❌ Error fetching instructor course data:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};


exports.createGrade = async (req, res) => {
  const { type, value, user_am, course_id, grade_batch_id } = req.body;

  if (!type || value == null || !user_am || !course_id || !grade_batch_id) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const result = await pool.query(`
      INSERT INTO grade (type, value, user_am, course_id, grade_batch_id)
      VALUES ($1, $2, $3, $4, $5) RETURNING *
    `, [type, value, user_am, course_id, grade_batch_id]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
};

exports.updateGrade = async (req, res) => {
  const { id } = req.params;
  const { value, status } = req.body;
  try {
    const result = await pool.query(`
      UPDATE grade SET value = $1, status = $2 WHERE id = $3 RETURNING *
    `, [value, status, id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Grade not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
};

exports.deleteGrade = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM grade WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Grade not found' });
    res.json({ message: 'Grade deleted', grade: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
};

exports.handleUpload = async (req, res) => {
  const uploader_id = req.user.sub;
  const filePath = req.file.path;
  const batch_type = req.params.type?.toUpperCase() || 'INITIAL';
  

  try {
    const workbook = XLSX.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet, { range: 2 }); // Skip 2 header rows

    const client = await pool.connect();
    const courseRegex = /\((\d+)\)/;
    const uploaded_at = new Date();
    const academic_year = uploaded_at.getFullYear();

    for (const row of rows) {
      const am = parseInt(row['Αριθμός Μητρώου']);
      const full_name = row['Ονοματεπώνυμο'];
      const email = row['Ακαδημαϊκό E-mail'];
      const grade = parseInt(row['Βαθμολογία']);
      const courseText = row['Τμήμα Τάξης'];
      const period = row['Περίοδος δήλωσης']; // e.g., "2024-2025 ΧΕΙΜ 2024"

      if (!am || isNaN(grade) || !courseText || !period) continue;

      const courseMatch = courseText.match(courseRegex);
      if (!courseMatch) continue;
      const course_id = parseInt(courseMatch[1]);

      // 1. Ensure grade_batch exists (reuse or insert)
      let grade_batch_id;
      const batchResult = await client.query(
        `SELECT id FROM grade_batch WHERE course_id = $1 AND academic_year = $2 AND type = $3`,
        [course_id, academic_year, batch_type]
      );
      
      
      if (batchResult.rowCount > 0) {
        grade_batch_id = batchResult.rows[0].id;
      } else { 
        const newBatch = await client.query(
          `INSERT INTO grade_batch (
            course_id, uploader_id, type, original_file, uploaded_at
          ) VALUES ($1, $2, $3, $4, $5) RETURNING id`,
          [course_id, uploader_id, batch_type, req.file.originalname, uploaded_at] 
        );
        grade_batch_id = newBatch.rows[0].id;
      }

      // 2. Ensure user exists by am
      let user_id;
      
      const findUser = await client.query('SELECT id FROM users WHERE am = $1', [am]);

      if (findUser.rowCount === 0) {
        try {
          const insertUser = await client.query(
            `INSERT INTO users (
              username, email, full_name, role, external_id, am, institution_id
            ) VALUES ($1, $2, $3, 'STUDENT', NULL, $4, 1) RETURNING id`,
            [`user_${am}`, email, full_name, am]
          );

          user_id = insertUser.rows[0].id;

          const provider_uid = email;
          const password_hash = '$2b$10$XButviiFJj1ReOWa6E6mcOvAefg37Jza9ppQBuKH7IvtMN9SjrHMC';

          await client.query(
            `INSERT INTO auth_account (
              user_id, provider, provider_uid, password_hash
            ) VALUES ($1, 'LOCAL', $2, $3)`,
            [user_id, provider_uid, password_hash]
          );

          console.log(`✅ Created user ${am} and auth_account: ${provider_uid}`);
        } catch (insertError) {
          console.error(`❌ Failed to insert auth_account for AM ${am}:`, insertError);
        }
      } else {
        user_id = findUser.rows[0].id;
      }

      // 3. Build detailed grade JSON (Q01–Q10)
      const detailed = {};
      for (let i = 1; i <= 10; i++) {
        const q = `Q${i.toString().padStart(2, '0')}`;
        detailed[q] = row[q] ?? null;
      }

      // 4. Insert grade using user_am
      await client.query(`
        INSERT INTO grade (
        value, user_am, course_id, grade_batch_id, detailed_grade_json, type
        ) VALUES ($1, $2, $3, $4, $5, $6)
      `, [grade, am, course_id, grade_batch_id, detailed, batch_type]);

    }

    client.release();
    fs.unlinkSync(filePath);
    res.status(200).json({ message: 'Grades uploaded successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Upload failed' });
  }
};


// 🔢 Ολική κατανομή βαθμών
exports.getTotalDistribution = async (req, res) => {
  const { courseId } = req.params;
  console.log('[getTotalDistribution]', { courseId });

  try {
    const query = `
      SELECT value AS grade, COUNT(*) AS count
      FROM grade
      WHERE course_id = $1 AND type = 'INITIAL'
      GROUP BY grade
      ORDER BY grade;
    `;

    const { rows } = await pool.query(query, [courseId]);

    const result = Array.from({ length: 10 }, (_, i) => {
      const found = rows.find(r => parseInt(r.grade) === i + 1);
      return { grade: i + 1, count: found ? parseInt(found.count) : 0 };
    });

    res.json(result);
  } catch (err) {
    console.error('[getTotalDistribution] DB error:', err.stack);
    res.status(500).json({ error: 'Failed to retrieve grade distribution.' });
  }
};


// 🔍 Κατανομή για συγκεκριμένη ερώτηση
exports.getQuestionDistribution = async (req, res) => {
  const { courseId, question } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT
        CAST(detailed_grade_json->>$1 AS INTEGER) AS grade,
        COUNT(*) AS count
      FROM grade
      WHERE course_id = $2 AND type = 'INITIAL'
        AND detailed_grade_json->>$1 IS NOT NULL
      GROUP BY grade
      ORDER BY grade
      `,
      [question, courseId]
    );

    // Δεν συμπληρώνουμε εδώ με 0s γιατί οι ερωτήσεις δεν έχουν πάντα 0–10
    const distribution = result.rows.map(r => ({
      grade: parseInt(r.grade),
      count: parseInt(r.count),
    }));

    res.json(distribution);
  } catch (err) {
    console.error('[getQuestionDistribution] DB error:', err.stack);
    res.status(500).json({ error: 'Failed to fetch question distribution' });
  }
};

// 🔑 GET /statistics/questions/:courseId
exports.getQuestionKeys = async (req, res) => {
  const { courseId } = req.params;

  try {
    const query = `
      SELECT jsonb_object_keys(detailed_grade_json) AS key
      FROM grade
      WHERE course_id = $1 AND type = 'INITIAL'
        AND detailed_grade_json IS NOT NULL
    `;

    const { rows } = await pool.query(query, [courseId]);
    const uniqueKeys = [...new Set(rows.map(r => r.key))].sort();

    res.json(uniqueKeys);
  } catch (err) {
    console.error('[getQuestionKeys] DB error:', err.stack);
    res.status(500).json({ error: 'Failed to retrieve question keys.' });
  }
};


