const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/authController');

// ➕ Authentication routes
router.post('/login', ctrl.login);
router.post('/signup', ctrl.signup);
router.post('/logout', ctrl.logout);

// ➕ Google OAuth routes
router.post('/verify-google', ctrl.verifyGoogle);
router.post('/verify-google-token', ctrl.verifyGoogleToken);
router.get('/google', ctrl.googleRedirect);
router.get('/google/callback', ctrl.googleCallback);

// ➕ User management
router.post('/users', ctrl.createUserByRole);  // Protected route

module.exports = router;