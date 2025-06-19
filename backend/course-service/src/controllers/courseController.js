const pool = require('../db');

exports.getAllCourses = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM courses.course ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
};

exports.getCourseById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM courses.course WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Course not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
};

exports.getCoursesForStudent = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`
      SELECT DISTINCT c.id, c.code, c.title, c.instructor_id
      FROM courses.course c
      JOIN courses.grade_batch g ON g.course_id = c.id
      WHERE g.uploader_id = $1
    `, [id]);
    res.json(result.rows);
  } catch (err) {
    console.error('❌ Error fetching courses for student:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getCoursesForInstructor = async (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT 
      c.id,
      c.title AS course_name,
      c.exam_period,
      c.description,
      COALESCE(
        TO_CHAR(MAX(CASE WHEN gb.type = 'INITIAL' THEN gb.uploaded_at END), 'YYYY-MM-DD'),
        '-' 
      ) AS initial_submission,
      COALESCE(
        TO_CHAR(MAX(CASE WHEN gb.type = 'FINAL' THEN gb.uploaded_at END), 'YYYY-MM-DD'),
        '-' 
      ) AS final_submission
    FROM courses.course c
    LEFT JOIN courses.grade_batch gb ON gb.course_id = c.id
    WHERE c.instructor_id = $1
    GROUP BY c.id, c.title, c.exam_period, c.description
    ORDER BY c.title;
  `;
  try {
    const result = await pool.query(query, [id]);
    res.json(result.rows);
  } catch (err) {
    console.error('❌ Error fetching instructor course data:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.createCourse = async (req, res) => {
  const { code, title, instructor_id, institution_id, description, exam_period } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO courses.course (code, title, instructor_id, institution_id, description, exam_period)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [code, title, instructor_id, institution_id, description, exam_period]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
};

exports.updateCourse = async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  try {
    const result = await pool.query(
      `UPDATE courses.course SET title = $1 WHERE id = $2 RETURNING *`,
      [title, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Course not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
};

exports.deleteCourse = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'DELETE FROM courses.course WHERE id = $1 RETURNING *',
      [id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Course not found' });
    res.json({ message: 'Course deleted', course: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
};
