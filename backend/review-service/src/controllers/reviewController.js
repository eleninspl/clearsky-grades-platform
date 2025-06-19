const pool = require('../db');

// Δημιουργία νέου αιτήματος επανεξέτασης με snapshot βαθμού
exports.createReviewRequest = async (req, res) => {
  const {
    grade_id, user_id, message,
    course_id, course_title, student_name,
    instructor_id, exam_period,
    grade_type, grade_value, detailed_grade_json
  } = req.body;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const reviewInsert = await client.query(`
      INSERT INTO review_request (
        grade_id, user_id, message,
        course_id, course_title, student_name,
        instructor_id, exam_period
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING *
    `, [grade_id, user_id, message, course_id, course_title, student_name, instructor_id, exam_period]);

    await client.query(`
      INSERT INTO review_grade_snapshot (
        grade_id, type, value, detailed_grade_json,
        course_id, user_id
      ) VALUES ($1,$2,$3,$4,$5,$6)
    `, [grade_id, grade_type, grade_value, detailed_grade_json, course_id, user_id]);

    await client.query('COMMIT');
    res.status(201).json(reviewInsert.rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Error creating review request:', err);
    res.status(500).json({ error: 'Database error' });
  } finally {
    client.release();
  }
};

// Επιστροφή όλων των review requests (π.χ. admin/debug)
exports.getAllReviewRequests = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM review_request ORDER BY submitted_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('❌ Error getting all review requests:', err);
    res.status(500).json({ error: 'Database error' });
  }
};

// Επιστροφή review requests για συγκεκριμένο instructor
exports.getReviewRequestsByInstructor = async (req, res) => {
  const { instructorId } = req.query;
  if (!instructorId) {
    return res.status(400).json({ error: 'Missing instructorId' });
  }

  try {
    const result = await pool.query(`
      SELECT id AS review_id, course_title, exam_period,
             student_name, message AS student_message
      FROM review_request
      WHERE instructor_id = $1 AND status = 'PENDING'
      ORDER BY submitted_at DESC
    `, [instructorId]);

    res.json(result.rows);
  } catch (err) {
    console.error('❌ Error fetching instructor review requests:', err);
    res.status(500).json({ error: 'Database error' });
  }
};

// Δημιουργία απάντησης σε αίτημα επανεξέτασης
exports.createReviewResponse = async (req, res) => {
  const { review_request_id, responder_id, message, final_grade } = req.body;

  if (!review_request_id || !responder_id || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // ΠΡΟΣΘΗΚΗ ΕΛΕΓΧΟΥ: έχει ήδη απαντηθεί;
    const existing = await client.query(
      `SELECT id FROM review_response WHERE review_request_id = $1`,
      [review_request_id]
    );

    if (existing.rowCount > 0) {
      await client.query('ROLLBACK');
      return res.status(409).json({ error: 'Response already exists for this request' });
    }

    // ΠΡΟΧΩΡΑ μόνο αν δεν υπάρχει
    await client.query(`
      INSERT INTO review_response (
        review_request_id, responder_id, message, final_grade
      ) VALUES ($1, $2, $3, $4)
    `, [review_request_id, responder_id, message, final_grade]);

    await client.query(`
      UPDATE review_request SET status = 'ANSWERED'
      WHERE id = $1
    `, [review_request_id]);

    await client.query('COMMIT');
    res.status(201).json({ message: 'Review response submitted successfully' });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('❌ Error submitting review response:', err);
    res.status(500).json({ error: 'Database error' });
  } finally {
    client.release();
  }
};


// Επιστροφή review requests για συγκεκριμένο student
exports.getReviewStatusForStudent = async (req, res) => {
  const { user_id, course_id } = req.query;

  if (!user_id || !course_id) {
    return res.status(400).json({ error: 'Missing user_id or course_id' });
  }

  try {
    const requestResult = await pool.query(`
      SELECT * FROM review_request
      WHERE user_id = $1 AND course_id = $2
    `, [user_id, course_id]);

    if (requestResult.rowCount === 0) {
      return res.status(404).json({ error: 'No review request found' });
    }

    const request = requestResult.rows[0];

    const responseResult = await pool.query(`
      SELECT message, final_grade, response_date, responder_id
      FROM review_response
      WHERE review_request_id = $1
    `, [request.id]);

    const response = responseResult.rows[0] || null;

    return res.json({
      status: request.status,
      submitted_at: request.submitted_at,
      course_title: request.course_title,
      exam_period: request.exam_period,
      instructor_id: request.instructor_id,
      instructor_response: response
    });
  } catch (err) {
    console.error('❌ Error fetching review status:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};