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

exports.getInstitutionAverageGrade = async (req, res) => {
  const creator = req.user;
  const inst = creator.inst ?? creator.institution_id;
  if (!inst) return res.status(403).json({ error: 'Missing institution ID in JWT' });

  try {
    const client = await pool.connect();
    const { rows } = await client.query(
      `SELECT COALESCE(AVG(g.value),0)::NUMERIC(5,2) AS average_grade
       FROM grade g
       JOIN course c ON g.course_id = c.id
       WHERE c.institution_id = $1
         AND g.status = 'FINAL'`,
      [inst]
    );
    client.release();

    res.json({ average_grade: rows[0].average_grade });
  } catch (err) {
    console.error('[getInstitutionAverageGrade]', err);
    res.status(500).json({ error: 'Database error' });
  }
};

exports.getInstitutionGradeDistribution = async (req, res) => {
  const creator = req.user;
  const inst = creator.inst ?? creator.institution_id;
  if (!inst) return res.status(403).json({ error: 'Missing institution ID in JWT' });

  try {
    const client = await pool.connect();
    const { rows } = await client.query(
      `SELECT width_bucket(g.value, 0, 100, 10) AS bucket,
              COUNT(*) AS count
       FROM grade g
       JOIN course c ON g.course_id = c.id
       WHERE c.institution_id = $1
         AND g.status = 'FINAL'
       GROUP BY bucket
       ORDER BY bucket`,
      [inst]
    );
    client.release();

    res.json({
      distribution: rows.map(r => ({
        bucket: r.bucket,
        count: parseInt(r.count, 10)
      }))
    });
  } catch (err) {
    console.error('[getInstitutionGradeDistribution]', err);
    res.status(500).json({ error: 'Database error' });
  }
};

exports.getInstitutionCourseEnrollment = async (req, res) => {
  const creator = req.user;
  const inst = creator.inst ?? creator.institution_id;
  if (!inst) return res.status(403).json({ error: 'Missing institution ID in JWT' });

  try {
    const client = await pool.connect();
    const { rows } = await client.query(
      `SELECT c.id, c.title,
              COUNT(DISTINCT g.user_am) AS enrolled_students
       FROM course c
       LEFT JOIN grade g
         ON g.course_id = c.id AND g.status = 'FINAL'
       WHERE c.institution_id = $1
       GROUP BY c.id, c.title
       ORDER BY enrolled_students DESC`,
      [inst]
    );
    client.release();

    res.json({
      enrollment: rows.map(r => ({
        courseId: r.id,
        title: r.title,
        enrolled: parseInt(r.enrolled_students, 10)
      }))
    });
  } catch (err) {
    console.error('[getInstitutionCourseEnrollment]', err);
    res.status(500).json({ error: 'Database error' });
  }
};


