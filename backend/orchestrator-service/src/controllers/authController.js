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

exports.googleRedirect = async (req, res) => {
  // Απλώς redirect προς το auth service
  const redirectUrl = `${process.env.AUTH_SERVICE_URL}/auth/google`;
  res.redirect(redirectUrl);
};

exports.googleCallback = async (req, res) => {
  try {
    const response = await axios.get(`${process.env.AUTH_SERVICE_URL}/auth/google/callback`, {
      headers: { Cookie: req.headers.cookie },
      maxRedirects: 0,
      validateStatus: status => status >= 200 && status < 400
    });
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json({ error: 'Google login failed' });
  }
};

exports.createUserByRole = async (req, res) => {
  try {
    const response = await axios.post(`${AUTH_SERVICE_URL}/auth/users`, req.body, {
      headers: {
        Authorization: req.headers.authorization
      }
    });
    res.status(201).json(response.data);
  } catch (err) {
    console.error('[Create user error]', err.response?.data || err.message);
    res.status(err.response?.status || 500).json({ error: 'User creation failed' });
  }
};
