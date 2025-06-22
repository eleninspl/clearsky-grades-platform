const express = require('express');
const passport = require('../passport');
const jwt = require('jsonwebtoken');
const ctrl = require('../controllers/authController');
const authorize = require('../middleware/authorize');

const router = express.Router();

// ───────────────────────────────────────────
// Local Authentication (Signup / Login / Logout)
// router.post('/signup', ctrl.signup);
router.post('/login', ctrl.login);
router.post('/logout', authorize(), ctrl.logout);

// ───────────────────────────────────────────
// Google Authentication (Token-based)
router.post('/verify-google', ctrl.verifyGoogle);
router.post('/verify-google-token', ctrl.verifyGoogleIdToken);

// ───────────────────────────────────────────
// Google OAuth (Redirect flow)
router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
  })
);

router.get('/google/callback', ctrl.googleOAuthCallback);

// ───────────────────────────────────────────
// User Management (Admin / Institutional Rep)
// router.get('/users/:id', ctrl.getUserById);

router.post(
  '/users',
  authorize(['ADMIN', 'INST_REP']),
  ctrl.createUserByRole
);

module.exports = router;
