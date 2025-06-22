const { publishUserCreated } = require('../rabbitmq');
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

exports.verifyGoogle = async (req, res) => {
  try {
    const response = await axios.post(`${AUTH_SERVICE_URL}/auth/verify-google`, req.body);
    res.json(response.data);
  } catch (err) {
    console.error('[Google verification error]', err.response?.data || err.message);
    res.status(err.response?.status || 500).json({ error: err.response?.data?.error || 'Google verification failed' });
  }
};

exports.verifyGoogleToken = async (req, res) => {
  try {
    const response = await axios.post(`${AUTH_SERVICE_URL}/auth/verify-google-token`, req.body);
    res.json(response.data);
  } catch (err) {
    console.error('[Google token verification error]', err.response?.data || err.message);
    res.status(err.response?.status || 500).json({ error: err.response?.data?.error || 'Google token verification failed' });
  }
};

exports.googleRedirect = async (req, res) => {
  // Redirect to auth service for Google OAuth
  const redirectUrl = `${AUTH_SERVICE_URL}/auth/google`;
  res.redirect(redirectUrl);
};

exports.googleCallback = async (req, res) => {
  try {
    // Forward the callback to the auth service
    const callbackUrl = `${AUTH_SERVICE_URL}/auth/google/callback${req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : ''}`;
    const response = await axios.get(callbackUrl, {
      maxRedirects: 0,
      validateStatus: status => status >= 200 && status < 400
    });

    // If the auth service returns a redirect, follow it
    if (response.status >= 300 && response.status < 400) {
      res.redirect(response.headers.location);
    } else {
      res.json(response.data);
    }
  } catch (err) {
    if (err.response?.status >= 300 && err.response?.status < 400) {
      // Handle redirect from auth service
      res.redirect(err.response.headers.location);
    } else {
      console.error('[Google callback error]', err.response?.data || err.message);
      res.status(err.response?.status || 500).json({ error: 'Google callback failed' });
    }
  }
};

exports.createUserByRole = async (req, res) => {
  try {
    // 🔄 Δημιουργία χρήστη στο auth-service
    const response = await axios.post(`${AUTH_SERVICE_URL}/auth/users`, req.body, {
      headers: {
        Authorization: req.headers.authorization
      }
    });

    // 🎯 Λήψη του χρήστη από το response
    const user = response.data.user || response.data;

    // 🔍 Logging για debugging
    console.log('🔍 Full user response:', user);

    const message = {
      userId: user.id,
      email: user.email,
      role: user.role,
      username: user.username || `user_${user.id}`,
      full_name: user.full_name || user.email.split('@')[0],
      institution_id: user.institution_id || 1,
      am: typeof user.am === 'number' ? user.am : null,
    };

    // ✅ Logging για RabbitMQ
    console.log('📨 Publishing message to RabbitMQ:', message);

    // ⚠️ Αν λείπουν βασικά πεδία, μην κάνεις publish
    if (!message.userId || !message.email || !message.role) {
      console.warn('⚠️ Incomplete user data for RabbitMQ message:', message);
      return res.status(500).json({ error: 'Incomplete user data – not published' });
    }

    // 📤 Στείλε το μήνυμα στο RabbitMQ
    await publishUserCreated(message);

    // ✅ Επιστροφή χρήστη στον client
    res.status(201).json(user);

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
