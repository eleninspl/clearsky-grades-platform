const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/authController');

// ➕ Login
router.post('/login', ctrl.login);
router.post('/signup', ctrl.signup);
router.post('/logout', ctrl.logout);

router.get('/google', ctrl.googleRedirect);
router.get('/google/callback', ctrl.googleCallback);
router.post('/users', ctrl.createUserByRole);  // Προστατευμένο

module.exports = router;
