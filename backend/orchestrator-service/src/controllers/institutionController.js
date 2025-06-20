const axios = require('axios');

const INSTITUTION_SERVICE_URL = process.env.INSTITUTION_SERVICE_URL;

const forward = async (req, res, method, path, data = null) => {
  try {
    const config = {
      method,
      url: `${INSTITUTION_SERVICE_URL}/institutions${path}`,
      headers: { Authorization: req.headers.authorization },
      data,
    };
    const response = await axios(config);
    res.status(response.status).json(response.data);
  } catch (err) {
    console.error(`[Institution ${method.toUpperCase()} ${path}]`, err.response?.data || err.message);
    res.status(err.response?.status || 500).json({
      error: err.response?.data?.error || 'Institution service error',
    });
  }
};

exports.getAll = (req, res) => forward(req, res, 'get', '');
exports.getById = (req, res) => forward(req, res, 'get', `/${req.params.id}`);
exports.create = (req, res) => forward(req, res, 'post', '', req.body);
exports.update = (req, res) => forward(req, res, 'put', `/${req.params.id}`, req.body);
exports.remove = (req, res) => forward(req, res, 'delete', `/${req.params.id}`);
exports.updateCredits = (req, res) => forward(req, res, 'patch', `/${req.params.id}/credits`, req.body);

// Stats
exports.getStats = (req, res) => forward(req, res, 'get', '/stats');
exports.getCourseEnrollment = (req, res) => forward(req, res, 'get', '/stats/course-enrollment');
