const express = require('express');
const passport = require('../passport');
const ctrl = require('../controllers/authController');
const authorize = require('../middleware/authorize');

const router = express.Router();

// ── Auth ─────────────────────
router.post('/login', ctrl.login);
router.post('/logout', authorize(), ctrl.logout);

// ── Google OAuth ─────────────
router.get('/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
  })
);
router.get('/google/callback', ctrl.googleOAuthCallback);
router.post('/verify-google', ctrl.verifyGoogle);
router.post('/verify-google-token', ctrl.verifyGoogleIdToken);

// ── Users ────────────────────
router.post('/users', authorize(['ADMIN', 'INST_REP']), ctrl.createUserByRole);

module.exports = router;
