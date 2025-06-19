const axios = require('axios');

const GRADES_SERVICE_URL = process.env.GRADES_SERVICE_URL || 'http://grades-service:5004';

const getStudentGrades = async (req, res) => {
  const { studentId } = req.params;

  try {
    const gradesRes = await axios.get(`${GRADES_SERVICE_URL}/grades/student/${studentId}`, {
      headers: {
        Authorization: req.headers.authorization
      }
    });

    res.json(gradesRes.data);
  } catch (err) {
    console.error(`❌ Failed to fetch grades for student ${studentId}:`, err.message);
    res.status(500).json({ error: 'Failed to fetch grades from grades-service' });
  }
};

module.exports = {
  getStudentGrades
};
