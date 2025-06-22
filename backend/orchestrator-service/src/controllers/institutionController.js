const axios = require('axios');
const BASE_URL = `${process.env.INSTITUTION_SERVICE_URL}/institutions`;

// GET /stats
exports.getStats = async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}/stats`, {
      headers: { Authorization: req.headers.authorization },
    });
    res.status(response.status).json(response.data);
  } catch (err) {
    const status = err.response?.status || 500;
    const message = err.response?.data?.error || 'Institution service error';
    console.error('[Institution GET /stats]', message);
    res.status(status).json({ error: message });
  }
};

// GET /stats/course-list
exports.getCourseList = async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}/stats/course-list`, {
      headers: { Authorization: req.headers.authorization },
    });
    res.status(response.status).json(response.data);
  } catch (err) {
    const status = err.response?.status || 500;
    const message = err.response?.data?.error || 'Institution service error';
    console.error('[Institution GET /stats/course-list]', message);
    res.status(status).json({ error: message });
  }
};
