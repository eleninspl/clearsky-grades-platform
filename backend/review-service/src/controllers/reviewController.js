const pool = require('../db');

// Δημιουργία νέου αιτήματος επανεξέτασης
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
    console.error('Error creating review request:', err);
    res.status(500).json({ error: 'Database error' });
  }
};

// Λήψη όλων των review requests (admin/debug)
exports.getAllReviewRequests = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM clearsky.review_request ORDER BY id
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Error getting all review requests:', err);
    res.status(500).json({ error: 'Database error' });
  }
};

// Λήψη ενός συγκεκριμένου review request
exports.getReviewRequestById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`
      SELECT * FROM clearsky.review_request WHERE id = $1
    `, [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error getting review request by ID:', err);
    res.status(500).json({ error: 'Database error' });
  }
};

// Δημιουργία απάντησης από instructor (με optional final_grade)
exports.createReviewResponse = async (req, res) => {
  const { review_request_id, responder_id, message, final_grade } = req.body;

  if (!review_request_id || !responder_id || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const result = await pool.query(`
      INSERT INTO clearsky.review_response
        (review_request_id, responder_id, message, final_grade)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [review_request_id, responder_id, message, final_grade]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating review response:', err);
    res.status(500).json({ error: 'Database error' });
  }
};

// Επιστροφή όλων των review requests για συγκεκριμένο καθηγητή
exports.getReviewRequestsByInstructor = async (req, res) => {
  const instructorId = req.query.instructorId;
  console.log('Instructor ID received:', instructorId);
  if (!instructorId) {
    return res.status(400).json({ error: 'Missing instructorId' });
  }

  try {
    const result = await pool.query(`
      SELECT
        rr.id AS review_id,
        c.title AS course_name,
        c.exam_period AS exam_period,
        u.full_name AS student_name,
        rr.message AS student_message
      FROM clearsky.review_request rr
      JOIN clearsky.grade g ON rr.grade_id = g.id
      JOIN clearsky.course c ON g.course_id = c.id
      JOIN clearsky.users u ON g.user_am = u.id
      WHERE c.instructor_id = $1
      ORDER BY rr.id DESC
    `, [instructorId]);
    
    console.log("Fetched", result.rowCount, "review requests");
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching review requests for instructor:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
