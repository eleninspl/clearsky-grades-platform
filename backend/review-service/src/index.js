const express = require('express');
const pool = require('./db');
require('dotenv').config();

const app = express();
app.use(express.json());

// Healthcheck
app.get('/', (req, res) => {
  res.send('Review service running 📝');
});

// Create review request
app.post('/review-requests', async (req, res) => {
  const { grade_id, message, user_id } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO clearsky.review_request (grade_id, message, user_id)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [grade_id, message, user_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating review request:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Get all review requests
app.get('/review-requests', async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM clearsky.review_request ORDER BY id`);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Get specific review request
app.get('/review-requests/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`SELECT * FROM clearsky.review_request WHERE id = $1`, [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Create response to review request
app.post('/review-responses', async (req, res) => {
  const { review_request_id, responder_id, message } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO clearsky.review_response (review_request_id, responder_id, message)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [review_request_id, responder_id, message]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating response:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

const PORT = process.env.PORT || 5006;
app.listen(PORT, () => {
  console.log(`Review service running on port ${PORT}`);
});
