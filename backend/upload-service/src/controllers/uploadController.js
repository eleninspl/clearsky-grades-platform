const fs = require('fs');
const xlsx = require('xlsx');
const axios = require('axios');

exports.handleUpload = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: 'Missing file' });

    const workbook = xlsx.readFile(file.path);
    const sheetName = workbook.SheetNames[0];
    const rows = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const errors = [];
    for (const row of rows) {
      const { user_id, course_id, value, type, grade_batch_id } = row;
      if (!user_id || !course_id || value == null || !type || !grade_batch_id) {
        errors.push(row);
        continue;
      }

      try {
        await axios.post('http://grades-service:5004/grades', {
          user_id,
          course_id,
          value,
          type,
          grade_batch_id
        }, {
          headers: {
            Authorization: req.headers['authorization']
          }
        });
      } catch (err) {
        errors.push(row);
      }
    }

    fs.unlinkSync(file.path); // καθαρισμός

    if (errors.length > 0) {
      return res.status(207).json({ message: 'Some grades failed', failed: errors });
    }

    res.json({ message: 'Upload successful' });

  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: 'Upload failed' });
  }
};
