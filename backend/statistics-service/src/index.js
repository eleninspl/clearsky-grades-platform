const express = require('express');
const pool = require('./db');
require('dotenv').config();

const app = express();
app.use(express.json());

// Healthcheck
app.get('/', (req, res) => {
  res.send('Statistics service running 📊');
});

// Get all statistics
app.get('/statistics', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM clearsky.grade_statistic ORDER BY course_id, type');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Get statistics for a specific course and type (e.g., INITIAL or FINAL)
app.get('/statistics/:courseId/:type', async (req, res) => {
  const { courseId, type } = req.params;
  try {
    const result = await pool.query(`
      SELECT * FROM clearsky.grade_statistic
      WHERE course_id = $1 AND type = $2
    `, [courseId, type.toUpperCase()]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Statistics not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Get all statistics for a specific course (both INITIAL and FINAL)
app.get('/statistics/course/:courseId', async (req, res) => {
  const { courseId } = req.params;
  try {
    const result = await pool.query(`
      SELECT * FROM clearsky.grade_statistic
      WHERE course_id = $1
    `, [courseId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No statistics for this course' });
    }

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// (Optional) Get statistics + course title
app.get('/statistics/details/:courseId/:type', async (req, res) => {
  const { courseId, type } = req.params;
  try {
    const result = await pool.query(`
      SELECT s.*, c.title
      FROM clearsky.grade_statistic s
      JOIN clearsky.course c ON s.course_id = c.id
      WHERE s.course_id = $1 AND s.type = $2
    `, [courseId, type.toUpperCase()]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Statistics with course info not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

const PORT = process.env.PORT || 5007;
app.listen(PORT, () => {
  console.log(`Statistics service running on port ${PORT}`);
});
