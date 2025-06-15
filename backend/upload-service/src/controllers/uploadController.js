const XLSX = require('xlsx');
const fs = require('fs');
const pool = require('../db.js');

exports.handleUpload = async (req, res) => {
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
        `SELECT id FROM clearsky.grade_batch WHERE course_id = $1 AND academic_year = $2 AND type = $3`,
        [course_id, academic_year, batch_type]
      );

      if (batchResult.rowCount > 0) {
        grade_batch_id = batchResult.rows[0].id;
      } else {
        const newBatch = await client.query(
          `INSERT INTO clearsky.grade_batch (
            course_id, uploader_id, type, original_file, uploaded_at
          ) VALUES ($1, $2, $3, $4, $5) RETURNING id`,
          [course_id, 102, batch_type, req.file.originalname, uploaded_at] // uploader_id = 1 placeholder
        );
        grade_batch_id = newBatch.rows[0].id;
      }

      // 2. Ensure user exists by am
      const findUser = await client.query(
        'SELECT am FROM clearsky.users WHERE am = $1',
        [am]
      );

      if (findUser.rowCount === 0) {
        await client.query(
          `INSERT INTO clearsky.users (
            username, email, full_name, role, external_id, am, institution_id
          ) VALUES ($1, $2, $3, 'STUDENT', NULL, $4, 1)`,
          [`user_${am}`, email, full_name, am]
        );
      }

      // 3. Build detailed grade JSON (Q01–Q10)
      const detailed = {};
      for (let i = 1; i <= 10; i++) {
        const q = `Q${i.toString().padStart(2, '0')}`;
        detailed[q] = row[q] ?? null;
      }

      // 4. Insert grade using user_am
      await client.query(`
        INSERT INTO clearsky.grade (
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
