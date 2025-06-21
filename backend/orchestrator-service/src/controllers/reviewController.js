const axios = require('axios');

const REVIEW_SERVICE_URL = process.env.REVIEW_SERVICE_URL;

const forward = async (req, res, method, path, data = null) => {
  try {
    const config = {
      method,
      url: `${REVIEW_SERVICE_URL}/review${path}`,
      headers: { Authorization: req.headers.authorization },
      data,
      params: req.query,
    };
    const response = await axios(config);
    res.status(response.status).json(response.data);
  } catch (err) {
    console.error(`[Review ${method.toUpperCase()} ${path}]`, err.response?.data || err.message);
    res.status(err.response?.status || 500).json({
      error: err.response?.data?.error || 'Review service error',
    });
  }
};

exports.createReviewRequest = (req, res) => forward(req, res, 'post', '/requests', req.body);
exports.getAllReviewRequests = (req, res) => forward(req, res, 'get', '/requests');
exports.getReviewRequestsByInstructor = (req, res) => forward(req, res, 'get', '/instructor');
exports.createReviewResponse = (req, res) => forward(req, res, 'post', '/responses', req.body);
exports.getReviewStatusForStudent = (req, res) => forward(req, res, 'get', '/status');
exports.getReviewRequestsForStudent = (req, res) =>  forward(req, res, 'get', `/requests/student/${req.params.studentId}`);
