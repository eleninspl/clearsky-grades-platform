const express = require('express');
const router = express.Router();
const controller = require('../controllers/userController');

// No auth needed — only internal microservices should access this
router.post('/users', controller.createUser);
router.get('/users/:id', controller.getUserById);
router.get('/users', controller.getUserByEmail);

module.exports = router;
