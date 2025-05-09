const XLSX = require('xlsx');
const fs = require('fs');
const pool = require('../db.js');

exports.handleUpload = async (req, res) => {
  const filePath = req.file.path;

  try {
    const workbook = XLSX.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet, { range: 2 }); // skip first two header rows

    const client = await pool.connect();

    for (const row of rows) {
      const am = row['Αριθμός Μητρώου'];
      const full_name = row['Ονοματεπώνυμο'];
      const email = row['Ακαδημαϊκό E-mail'];
      const grade = row['Βαθμολογία'];

      // Detailed grade JSON
      const detailed = {};
      for (let i = 1; i <= 10; i++) {
        const q = `Q${i.toString().padStart(2, '0')}`;
        detailed[q] = row[q] ?? null;
      }

      // 1. Insert or find user
      const findUser = await client.query(
        'SELECT id FROM clearsky.users WHERE am = $1',
        [am]
      );

      let userId;
      if (findUser.rowCount > 0) {
        userId = findUser.rows[0].id;
      } else {
        const insertUser = await client.query(
          `INSERT INTO clearsky.users (username, email, full_name, role, external_id, am, institution_id)
           VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
          [
            `user_${am}`,
            email,
            full_name,
            'STUDENT',
            null,
            am,
            1
          ]
        );
        userId = insertUser.rows[0].id;
      }

      // 2. Insert grade
      await client.query(
        `INSERT INTO clearsky.grade (
          value, user_id, course_id, grade_batch_id, detailed_grade_json
        ) VALUES ($1, $2, $3, $4, $5)`,
        [
          grade,
          userId,
          1, // course_id placeholder
          1, // grade_batch_id placeholder
          detailed
        ]
      );
    }

    client.release();
    fs.unlinkSync(filePath);
    res.status(200).json({ message: 'Data inserted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Upload failed' });
  }
};
