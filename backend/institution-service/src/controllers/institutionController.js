const pool = require('../db');

exports.getAllInstitutions = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM institution ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error('DB error:', err);
    res.status(500).json({ error: 'Database error' });
  }
};

exports.getInstitutionById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM institution WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Institution not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
};

exports.createInstitution = async (req, res) => {
  const { name, email } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO institution (name, email) VALUES ($1, $2) RETURNING *',
      [name, email]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
};

exports.updateInstitution = async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  try {
    const result = await pool.query(
      'UPDATE institution SET name = $1, email = $2 WHERE id = $3 RETURNING *',
      [name, email, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Institution not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
};

exports.deleteInstitution = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'DELETE FROM institution WHERE id = $1 RETURNING *',
      [id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Institution not found' });
    res.json({ message: 'Institution deleted', institution: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
};

exports.getInstitutionStats = async (req, res) => {
  const creator = req.user;
  const inst = creator.inst;

  if (!creator.inst) return res.status(403).json({ error: 'Missing institution ID in JWT' });

  try {
    const client = await pool.connect();


    const [studentsRes, instructorsRes, coursesRes] = await Promise.all([
      client.query(`SELECT COUNT(*) FROM users WHERE institution_id = $1 AND role = 'STUDENT'`, [inst]),
      client.query(`SELECT COUNT(*) FROM users WHERE institution_id = $1 AND role = 'INSTRUCTOR'`, [inst]),
      client.query(`SELECT COUNT(*) FROM course WHERE institution_id = $1`, [inst])
    ]);

    client.release();

    res.json({
      students: parseInt(studentsRes.rows[0].count),
      instructors: parseInt(instructorsRes.rows[0].count),
      active_courses: parseInt(coursesRes.rows[0].count)
    });
  } catch (err) {
    console.error('[getInstitutionStats]', err);
    res.status(500).json({ error: 'Database error while fetching stats' });
  }
};

exports.getCourseListWithInstructors = async (req, res) => {
  const inst = req.user.inst ?? req.user.institution_id;
  if (!inst) return res.status(403).json({ error: 'Missing institution ID in JWT' });

  try {
    const result = await pool.query(`
      SELECT 
        c.code AS course_code,
        c.title AS course_title,
        u.full_name AS instructor_name
      FROM course c
      JOIN users u ON u.id = c.instructor_id
      WHERE c.institution_id = $1
      ORDER BY c.title
    `, [inst]);

    const courses = result.rows.map(row => ({
      courseCode: row.course_code,
      courseTitle: row.course_title,
      instructorName: row.instructor_name
    }));

    res.json({ courses });
  } catch (err) {
    console.error('[getCourseListWithInstructors]', err);
    res.status(500).json({ error: 'Database error' });
  }
};

exports.updateCreditsBalance = async (req, res) => {
  const { id } = req.params;
  const { delta } = req.body;
  if (typeof delta !== 'number') {
    return res.status(400).json({ error: 'Missing or invalid delta' });
  }
  try {
    const result = await pool.query(
      'UPDATE institution SET credits_balance = credits_balance + $1 WHERE id = $2 RETURNING *',
      [delta, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Institution not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
};


