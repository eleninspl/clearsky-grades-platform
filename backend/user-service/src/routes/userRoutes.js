const express = require('express');
const router = express.Router();
const controller = require('../controllers/userController');
const authenticateToken = require('../authMiddleware');

router.get('/me', authenticateToken, controller.handleMe);

module.exports = router;
