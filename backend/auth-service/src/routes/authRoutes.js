const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('../controllers/authController');

// Step 1: Redirect to Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Step 2: Callback
router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/' }),
  authController.handleGoogleCallback
);

module.exports = router;
