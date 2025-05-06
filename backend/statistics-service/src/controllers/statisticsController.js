const pool = require('../db');

exports.getAll = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM clearsky.grade_statistic ORDER BY course_id, type');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
};

exports.getByCourseAndType = async (req, res) => {
  const { courseId, type } = req.params;
  try {
    const result = await pool.query(`
      SELECT * FROM clearsky.grade_statistic
      WHERE course_id = $1 AND type = $2
    `, [courseId, type.toUpperCase()]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Statistics not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
};

exports.getByCourse = async (req, res) => {
  const { courseId } = req.params;
  try {
    const result = await pool.query(`
      SELECT * FROM clearsky.grade_statistic
      WHERE course_id = $1
    `, [courseId]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'No statistics for this course' });
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
};

exports.getWithCourseInfo = async (req, res) => {
  const { courseId, type } = req.params;
  try {
    const result = await pool.query(`
      SELECT s.*, c.title
      FROM clearsky.grade_statistic s
      JOIN clearsky.course c ON s.course_id = c.id
      WHERE s.course_id = $1 AND s.type = $2
    `, [courseId, type.toUpperCase()]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Statistics with course info not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
};
