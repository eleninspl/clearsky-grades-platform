const express = require('express');
const pool = require('./db');
require('dotenv').config();

const app = express();
app.use(express.json());

// Healthcheck
app.get('/', (req, res) => {
  res.send('Grades service running 🎓');
});

// GET all grades
app.get('/grades', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM clearsky.grade ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// GET grade by ID
app.get('/grades/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM clearsky.grade WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Grade not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// POST new grade
app.post('/grades', async (req, res) => {
  const { type, value, user_id, course_id, grade_batch_id } = req.body;
  try {
    const result = await pool.query(`
      INSERT INTO clearsky.grade (type, value, user_id, course_id, grade_batch_id)
      VALUES ($1, $2, $3, $4, $5) RETURNING *
    `, [type, value, user_id, course_id, grade_batch_id]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// PUT update grade
app.put('/grades/:id', async (req, res) => {
  const { id } = req.params;
  const { value, status } = req.body;
  try {
    const result = await pool.query(`
      UPDATE clearsky.grade SET value = $1, status = $2 WHERE id = $3 RETURNING *
    `, [value, status, id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Grade not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// DELETE grade
app.delete('/grades/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM clearsky.grade WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Grade not found' });
    res.json({ message: 'Grade deleted', grade: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

const PORT = process.env.PORT || 5004;
app.listen(PORT, () => {
  console.log(`Grades service running on port ${PORT}`);
});
