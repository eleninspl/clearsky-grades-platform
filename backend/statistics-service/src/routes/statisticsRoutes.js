const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/statisticsController');

router.get('/', ctrl.getAll);
router.get('/course/:courseId', ctrl.getByCourse);
router.get('/:courseId/:type', ctrl.getByCourseAndType);
router.get('/details/:courseId/:type', ctrl.getWithCourseInfo);

module.exports = router;
