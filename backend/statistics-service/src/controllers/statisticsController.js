const pool = require('../db');

// Validate enum-like input
const isValidType = (type) => ['INITIAL', 'FINAL'].includes(type?.toUpperCase());

// GET /statistics
exports.getAll = async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM clearsky.grade_statistic ORDER BY course_id, type'
    );
    res.json(rows);
  } catch (err) {
    console.error('[getAll] DB error:', err.stack);
    res.status(500).json({ error: 'Internal server error while fetching statistics.' });
  }
};

// GET /statistics/:courseId/:type
exports.getByCourseAndType = async (req, res) => {
  const { courseId, type } = req.params;

  if (!isValidType(type)) {
    return res.status(400).json({ error: 'Invalid grade type.' });
  }

  try {
    const { rows } = await pool.query(
      'SELECT * FROM clearsky.grade_statistic WHERE course_id = $1 AND type = $2',
      [courseId, type.toUpperCase()]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'No statistics found for this course and type.' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error('[getByCourseAndType] DB error:', err.stack);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

// GET /statistics/course/:courseId
exports.getByCourse = async (req, res) => {
  const { courseId } = req.params;

  try {
    const { rows } = await pool.query(
      'SELECT * FROM clearsky.grade_statistic WHERE course_id = $1',
      [courseId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'No statistics found for this course.' });
    }

    res.json(rows);
  } catch (err) {
    console.error('[getByCourse] DB error:', err.stack);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

// GET /statistics/details/:courseId/:type
exports.getWithCourseInfo = async (req, res) => {
  const { courseId, type } = req.params;

  if (!isValidType(type)) {
    return res.status(400).json({ error: 'Invalid grade type.' });
  }

  try {
    const { rows } = await pool.query(
      `SELECT s.*, c.title
       FROM clearsky.grade_statistic s
       JOIN clearsky.course c ON s.course_id = c.id
       WHERE s.course_id = $1 AND s.type = $2`,
      [courseId, type.toUpperCase()]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Statistics with course info not found.' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error('[getWithCourseInfo] DB error:', err.stack);
    res.status(500).json({ error: 'Internal server error.' });
  }
};

// 🔢 Ολική κατανομή βαθμών
exports.getTotalDistribution = async (req, res) => {
  const { courseId } = req.params;
  console.log('[getTotalDistribution]', { courseId });

  try {
    const query = `
      SELECT value AS grade, COUNT(*) AS count
      FROM clearsky.grade
      WHERE course_id = $1 AND type = 'INITIAL'
      GROUP BY grade
      ORDER BY grade;
    `;

    const { rows } = await pool.query(query, [courseId]);

    const result = Array.from({ length: 10 }, (_, i) => {
      const found = rows.find(r => parseInt(r.grade) === i + 1);
      return { grade: i + 1, count: found ? parseInt(found.count) : 0 };
    });

    res.json(result);
  } catch (err) {
    console.error('[getTotalDistribution] DB error:', err.stack);
    res.status(500).json({ error: 'Failed to retrieve grade distribution.' });
  }
};


// 🔍 Κατανομή για συγκεκριμένη ερώτηση
exports.getQuestionDistribution = async (req, res) => {
  const { courseId, question } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT
        CAST(detailed_grade_json->>$1 AS INTEGER) AS grade,
        COUNT(*) AS count
      FROM clearsky.grade
      WHERE course_id = $2 AND type = 'INITIAL'
        AND detailed_grade_json->>$1 IS NOT NULL
      GROUP BY grade
      ORDER BY grade
      `,
      [question, courseId]
    );

    // Δεν συμπληρώνουμε εδώ με 0s γιατί οι ερωτήσεις δεν έχουν πάντα 0–10
    const distribution = result.rows.map(r => ({
      grade: parseInt(r.grade),
      count: parseInt(r.count),
    }));

    res.json(distribution);
  } catch (err) {
    console.error('[getQuestionDistribution] DB error:', err.stack);
    res.status(500).json({ error: 'Failed to fetch question distribution' });
  }
};

// 🔑 GET /statistics/questions/:courseId
exports.getQuestionKeys = async (req, res) => {
  const { courseId } = req.params;

  try {
    const query = `
      SELECT jsonb_object_keys(detailed_grade_json) AS key
      FROM clearsky.grade
      WHERE course_id = $1 AND type = 'INITIAL'
        AND detailed_grade_json IS NOT NULL
    `;

    const { rows } = await pool.query(query, [courseId]);
    const uniqueKeys = [...new Set(rows.map(r => r.key))].sort();

    res.json(uniqueKeys);
  } catch (err) {
    console.error('[getQuestionKeys] DB error:', err.stack);
    res.status(500).json({ error: 'Failed to retrieve question keys.' });
  }
};



// POST /statistics/recalculate/:courseId/:type
exports.recalculateStatistics = async (req, res) => {
  const { courseId, type } = req.params;

  if (!isValidType(type)) {
    return res.status(400).json({ error: 'Invalid grade type.' });
  }

  try {
    // Fake update to trigger the statistic-refresh trigger
    const result = await pool.query(
      `UPDATE clearsky.grade
       SET uploaded_at = uploaded_at
       WHERE course_id = $1 AND type = $2`,
      [courseId, type.toUpperCase()]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'No grades found to recalculate statistics.' });
    }

    const { rows } = await pool.query(
      'SELECT * FROM clearsky.grade_statistic WHERE course_id = $1 AND type = $2',
      [courseId, type.toUpperCase()]
    );

    res.json({
      message: 'Statistics recalculated successfully.',
      statistics: rows[0],
    });
  } catch (err) {
    console.error('[recalculateStatistics] DB error:', err.stack);
    res.status(500).json({ error: 'Failed to recalculate statistics.' });
  }
};
