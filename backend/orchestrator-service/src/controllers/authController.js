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



// src/controllers/authController.js
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
require('dotenv').config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ⬇️ GOOGLE LOGIN HANDLER
exports.handleGoogleLogin = async (req, res) => {
  const { id_token } = req.body;

  if (!id_token) {
    return res.status(400).json({ error: 'Missing id_token' });
  }

  try {
    // 1. Verify token with Google
    const ticket = await client.verifyIdToken({
      idToken: id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const email = payload.email;
    const fullName = payload.name;

    // 2. Communicate with auth-service to verify user
    const authServiceUrl = `${process.env.AUTH_SERVICE_URL}/verify-google`;

    const response = await axios.post(authServiceUrl, { email });

    const user = response.data;

    if (!user || user.role !== 'STUDENT') {
      return res.status(403).json({ error: 'User not authorized or not a student' });
    }

    // 3. Issue JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    return res.status(200).json({ token });

  } catch (error) {
    console.error('Google login failed:', error);
    return res.status(401).json({ error: 'Invalid Google token or internal error' });
  }
};
