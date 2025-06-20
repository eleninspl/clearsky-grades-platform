const axios = require('axios');

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL;

exports.login = async (req, res) => {
  try {
    const response = await axios.post(`${AUTH_SERVICE_URL}/auth/login`, req.body);
    res.json(response.data);
  } catch (err) {
    console.error('[Login error]', err.response?.data || err.message);
    res.status(err.response?.status || 500).json({ error: err.response?.data?.message || 'Login failed' });
  }
};

exports.signup = async (req, res) => {
  try {
    const response = await axios.post(`${AUTH_SERVICE_URL}/auth/signup`, req.body);
    res.json(response.data);
  } catch (err) {
    console.error('[Signup error]', err.response?.data || err.message);
    res.status(err.response?.status || 500).json({ error: err.response?.data?.message || 'Signup failed' });
  }
};

exports.logout = async (req, res) => {
  try {
    const response = await axios.post(`${AUTH_SERVICE_URL}/auth/logout`, null, {
      headers: {
        Authorization: req.headers.authorization
      }
    });
    res.json(response.data);
  } catch (err) {
    console.error('[Logout error]', err.response?.data || err.message);
    res.status(err.response?.status || 500).json({ error: err.response?.data?.error || 'Logout failed' });
  }
};
