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
        g.grade_batch_id,
        g.course_id,
        c.title AS course_title,
        c.exam_period AS exam_period,
        c.instructor_id,                       -- 👈 ΕΔΩ
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
  const { value } = req.body;
  try {
    const result = await pool.query(`
      UPDATE grade SET value = $1 WHERE id = $2 RETURNING *
    `, [value, id]);
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

    const expectedColumns = [
      'Αριθμός Μητρώου', 'Ονοματεπώνυμο', 'Ακαδημαϊκό E-mail',
      'Περίοδος δήλωσης', 'Τμήμα Τάξης', 'Κλίμακα βαθμολόγησης',
      'Βαθμολογία', 'Q01', 'Q02', 'Q03', 'Q04', 'Q05',
      'Q06', 'Q07', 'Q08', 'Q09', 'Q10'
    ];

    const actualColumns = XLSX.utils.sheet_to_json(sheet, { header: 1, range: 2 })[0];
    const missingColumns = expectedColumns.filter(col => !actualColumns.includes(col));

    if (missingColumns.length > 0) {
      fs.unlinkSync(filePath);
      return res.status(400).json({
        error: `Wrong file format. Missing columns: ${missingColumns.join(', ')}`
      });
    }

    const rows = XLSX.utils.sheet_to_json(sheet, { range: 2 });
    console.log(`📊 Parsed ${rows.length} rows from Excel`);
    if (rows.length === 0) throw new Error('Excel file contains no student rows');

    const client = await pool.connect();
    const courseRegex = /\((\d+)\)/;
    const uploaded_at = new Date();
    const academic_year = uploaded_at.getFullYear();

    await client.query('BEGIN');

    // Use first row to determine course_id and validate review_state
    const firstRow = rows[0];
    const courseText = firstRow['Τμήμα Τάξης'];
    const courseMatch = courseText.match(courseRegex);
    if (!courseMatch) throw new Error(`Invalid course format in row 1: ${courseText}`);

    const course_id = parseInt(courseMatch[1]);

    const reviewStateResult = await client.query(
      `SELECT review_state FROM course WHERE id = $1`,
      [course_id]
    );

    if (reviewStateResult.rowCount === 0) {
      throw new Error(`Course with ID ${course_id} not found`);
    }

    const currentState = reviewStateResult.rows[0].review_state;

    if (batch_type === 'INITIAL' && currentState !== 'VOID') {
      throw new Error(`Initial grades can only be uploaded when review_state is VOID (currently: ${currentState})`);
    }

    if (batch_type === 'FINAL' && currentState !== 'OPEN') {
      throw new Error(`Final grades can only be uploaded when review_state is OPEN (currently: ${currentState})`);
    }

    // Find or create grade batch
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

    // Update course.review_state
    if (['INITIAL', 'FINAL'].includes(batch_type)) {
      const new_state = batch_type === 'INITIAL' ? 'OPEN' : 'CLOSED';
      await client.query(
        `UPDATE course SET review_state = $1 WHERE id = $2`,
        [new_state, course_id]
      );
    }

    // Process rows
    for (const [index, row] of rows.entries()) {
      try {
        const am = parseInt(row['Αριθμός Μητρώου']);
        const full_name = row['Ονοματεπώνυμο'];
        const email = row['Ακαδημαϊκό E-mail'];
        const grade = parseInt(row['Βαθμολογία']);

        if (!am || isNaN(grade)) {
          console.warn(`⚠️ Row ${index + 3}: Skipped due to missing AM or invalid grade.`);
          continue;
        }

        if (!email || !full_name) {
          throw new Error(`Row ${index + 3}: Missing email or full_name for AM ${am}`);
        }

        // Handle user
        let user_id;
        const findUser = await client.query('SELECT id FROM users WHERE am = $1', [am]);

        if (findUser.rowCount === 0) {
          const insertUser = await client.query(
            `INSERT INTO users (
              username, email, full_name, role, external_id, am, institution_id
            ) VALUES ($1, $2, $3, 'STUDENT', NULL, $4, 1) RETURNING id`,
            [`user_${am}`, email, full_name, am]
          );

          user_id = insertUser.rows[0].id;

          await client.query(
            `INSERT INTO auth_account (
              user_id, provider, provider_uid, password_hash
            ) VALUES ($1, 'LOCAL', $2, $3)`,
            [user_id, email, '$2b$10$XButviiFJj1ReOWa6E6mcOvAefg37Jza9ppQBuKH7IvtMN9SjrHMC']
          );

          console.log(`✅ Created user ${am}`);
        } else {
          user_id = findUser.rows[0].id;
        }

        // Detailed grade JSON
        const detailed = {};
        for (let i = 1; i <= 10; i++) {
          const q = `Q${i.toString().padStart(2, '0')}`;
          detailed[q] = row[q] ?? null;
        }

        const existingGrade = await client.query(
          `SELECT id FROM grade WHERE user_am = $1 AND course_id = $2 AND grade_batch_id = $3`,
          [am, course_id, grade_batch_id]
        );

        if (existingGrade.rowCount > 0) {
          await client.query(
            `UPDATE grade
             SET value = $1, detailed_grade_json = $2, type = $3
             WHERE user_am = $4 AND course_id = $5 AND grade_batch_id = $6`,
            [grade, detailed, batch_type, am, course_id, grade_batch_id]
          );
          console.log(`🔁 Updated grade for AM ${am}`);
        } else {
          await client.query(
            `INSERT INTO grade (
              value, user_am, course_id, grade_batch_id, detailed_grade_json, type
            ) VALUES ($1, $2, $3, $4, $5, $6)`,
            [grade, am, course_id, grade_batch_id, detailed, batch_type]
          );
          console.log(`✅ Inserted new grade for AM ${am}`);
        }
      } catch (rowErr) {
        console.error(`❌ Error in row ${index + 3} (AM: ${row['Αριθμός Μητρώου']}): ${rowErr.message}`);
        continue;
      }
    }

    await client.query('COMMIT');
    client.release();
    fs.unlinkSync(filePath);
    return res.status(200).json({ message: 'Grades uploaded successfully' });

  } catch (err) {
    console.error('❌ Upload failed:', err.stack || err.message || err);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    return res.status(400).json({ error: err.message });
  }
};



// 🔢 Ολική κατανομή βαθμών
exports.getTotalDistribution = async (req, res) => {
  const { courseId, type } = req.params;
  const gradeType = type?.toUpperCase();

  if (!isValidType(gradeType)) {
    return res.status(400).json({ error: 'Invalid grade type' });
  }

  try {
    const query = `
      SELECT value AS grade, COUNT(*) AS count
      FROM grade
      WHERE course_id = $1 AND type = $2
      GROUP BY grade
      ORDER BY grade;
    `;

    const { rows } = await pool.query(query, [courseId, gradeType]);

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
  const { courseId, type, question } = req.params;
  const gradeType = type?.toUpperCase();

  if (!isValidType(gradeType)) {
    return res.status(400).json({ error: 'Invalid grade type' });
  }

  try {
    const result = await pool.query(
      `
      SELECT
        CAST(detailed_grade_json->>$1 AS INTEGER) AS grade,
        COUNT(*) AS count
      FROM grade
      WHERE course_id = $2 AND type = $3
        AND detailed_grade_json->>$1 IS NOT NULL
      GROUP BY grade
      ORDER BY grade
      `,
      [question, courseId, gradeType]
    );

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
  const { courseId, type } = req.params;
  const gradeType = type?.toUpperCase();

  if (!isValidType(gradeType)) {
    return res.status(400).json({ error: 'Invalid grade type' });
  }

  try {
    const query = `
      SELECT jsonb_object_keys(detailed_grade_json) AS key
      FROM grade
      WHERE course_id = $1 AND type = $2
        AND detailed_grade_json IS NOT NULL
    `;

    const { rows } = await pool.query(query, [courseId, gradeType]);
    const uniqueKeys = [...new Set(rows.map(r => r.key))].sort();

    res.json(uniqueKeys);
  } catch (err) {
    console.error('[getQuestionKeys] DB error:', err.stack);
    res.status(500).json({ error: 'Failed to retrieve question keys.' });
  }
};

