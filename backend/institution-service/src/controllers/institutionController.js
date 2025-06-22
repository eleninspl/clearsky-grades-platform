const pool = require('../db');

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

