const axios = require('axios');

const CREDITS_SERVICE_URL = process.env.CREDITS_SERVICE_URL;

const forward = async (req, res, method, path, data = null) => {
  try {
    const config = {
      method,
      url: `${CREDITS_SERVICE_URL}/credits${path}`,
      headers: { Authorization: req.headers.authorization },
      data,
      params: req.query,
    };
    const response = await axios(config);
    res.status(response.status).json(response.data);
  } catch (err) {
    console.error(`[Credits ${method.toUpperCase()} ${path}]`, err.response?.data || err.message);
    res.status(err.response?.status || 500).json({
      error: err.response?.data?.error || 'Credits service error',
    });
  }
};

// Controllers
exports.getBalance = (req, res) => forward(req, res, 'get', `/${req.params.institutionId}/balance`);
exports.buyCredits = (req, res) => forward(req, res, 'post', `/${req.params.institutionId}/buy`, req.body);
exports.getHistory = (req, res) => forward(req, res, 'get', `/${req.params.institutionId}/history`);
