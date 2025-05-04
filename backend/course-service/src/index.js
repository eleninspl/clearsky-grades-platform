const express = require('express');
const pool = require('./db');
require('dotenv').config();

const app = express();
app.use(express.json());

// Health check
app.get('/', (req, res) => {
  res.send('Course service running 📚');
});

// GET all courses
app.get('/courses', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM clearsky.course ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// GET course by ID
app.get('/courses/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM clearsky.course WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Course not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// POST new course
app.post('/courses', async (req, res) => {
  const { code, title, instructor_id, institution_id } = req.body;
  try {
    const result = await pool.query(`
      INSERT INTO clearsky.course (code, title, instructor_id, institution_id)
      VALUES ($1, $2, $3, $4) RETURNING *
    `, [code, title, instructor_id, institution_id]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// PUT update course
app.put('/courses/:id', async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  try {
    const result = await pool.query(`
      UPDATE clearsky.course SET title = $1 WHERE id = $2 RETURNING *
    `, [title, id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Course not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// DELETE course
app.delete('/courses/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'DELETE FROM clearsky.course WHERE id = $1 RETURNING *',
      [id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Course not found' });
    res.json({ message: 'Course deleted', course: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

const PORT = process.env.PORT || 5005;
app.listen(PORT, () => {
  console.log(`Course service running on port ${PORT}`);
});
