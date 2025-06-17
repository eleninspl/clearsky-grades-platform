const express = require('express');
const router = express.Router();
const controller = require('../controllers/userController');
const authorize = require('../middleware/authorize');

router.get('/', controller.handleMe);

module.exports = router;
