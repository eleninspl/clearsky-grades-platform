const pool = require('../db');

// Get all statistics
exports.getAll = async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM clearsky.grade_statistic ORDER BY course_id, type'
    );    
    res.json(rows);
  } catch (err) {
    console.error('Error fetching all statistics:', err);
    res.status(500).json({ error: 'Internal server error while fetching statistics.' });
  }
};

// Get statistics by course and type
exports.getByCourseAndType = async (req, res) => {
  const { courseId, type } = req.params;
  try {
    const { rows } = await pool.query(
      'SELECT * FROM clearsky.grade_statistic WHERE course_id = $1 AND type = $2',
      [courseId, type.toUpperCase()]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'No statistics found for this course and type.' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error('Error fetching statistics by course and type:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

// Get all statistics for a course (e.g., INITIAL + FINAL)
exports.getByCourse = async (req, res) => {
  const { courseId } = req.params;
  try {
    const { rows } = await pool.query(
      'SELECT * FROM clearsky.grade_statistic WHERE course_id = $1',
      [courseId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'No statistics found for this course.' });
    }

    res.json(rows);
  } catch (err) {
    console.error('Error fetching statistics by course:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

// Get statistics with course title
exports.getWithCourseInfo = async (req, res) => {
  const { courseId, type } = req.params;
  try {
    const { rows } = await pool.query(
      `SELECT s.*, c.title
       FROM clearsky.grade_statistic s
       JOIN clearsky.course c ON s.course_id = c.id
       WHERE s.course_id = $1 AND s.type = $2`,
      [courseId, type.toUpperCase()]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Statistics with course info not found.' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error('Error fetching statistics with course info:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
};
