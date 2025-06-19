const pool = require('../db');

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
        id AS grade_id,
        value AS grade,
        type,
        status,
        grade_batch_id,
        course_id,
        detailed_grade_json
      FROM grade
      WHERE user_am = $1
      ORDER BY course_id, type
    `, [id]);

    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching grades for student:', err);
    res.status(500).json({ error: 'Database error' });
  }
};


exports.createGrade = async (req, res) => {
  const { type, value, user_id, course_id, grade_batch_id } = req.body;

  if (!type || value == null || !user_id || !course_id || !grade_batch_id) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const result = await pool.query(`
      INSERT INTO grade (type, value, user_id, course_id, grade_batch_id)
      VALUES ($1, $2, $3, $4, $5) RETURNING *
    `, [type, value, user_id, course_id, grade_batch_id]);
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
