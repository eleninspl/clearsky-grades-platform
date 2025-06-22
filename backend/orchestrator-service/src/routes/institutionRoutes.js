const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/institutionController');

router.get('/stats', ctrl.getStats);
router.get('/stats/course-list', ctrl.getCourseList);

module.exports = router;
