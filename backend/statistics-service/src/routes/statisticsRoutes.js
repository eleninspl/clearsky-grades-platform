const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/statisticsController');
const authorize = require('../middleware/authorize');

router.get('/questions/:courseId', ctrl.getQuestionKeys);
router.get('/distribution/:courseId', ctrl.getTotalDistribution);
router.get('/distribution/:courseId/q/:question', ctrl.getQuestionDistribution);

module.exports = router;
