const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/authController');

// ➕ Login
router.post('/login', ctrl.login);
router.post('/signup', ctrl.signup);
router.post('/logout', ctrl.logout);

module.exports = router;
