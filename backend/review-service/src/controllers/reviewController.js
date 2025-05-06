const pool = require('../db');

exports.createReviewRequest = async (req, res) => {
  const { grade_id, message, user_id } = req.body;
  try {
    const result = await pool.query(`
      INSERT INTO clearsky.review_request (grade_id, message, user_id)
      VALUES ($1, $2, $3) RETURNING *`,
      [grade_id, message, user_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
};

exports.getAllReviewRequests = async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM clearsky.review_request ORDER BY id`);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
};

exports.getReviewRequestById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`SELECT * FROM clearsky.review_request WHERE id = $1`, [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
};

exports.createReviewResponse = async (req, res) => {
  const { review_request_id, responder_id, message } = req.body;
  try {
    const result = await pool.query(`
      INSERT INTO clearsky.review_response (review_request_id, responder_id, message)
      VALUES ($1, $2, $3) RETURNING *`,
      [review_request_id, responder_id, message]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
};
