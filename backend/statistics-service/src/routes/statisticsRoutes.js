const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/statisticsController');

router.get('/', ctrl.getAll);
router.post('/recalculate/:courseId/:type', ctrl.recalculateStatistics);
router.get('/details/:courseId/:type', ctrl.getWithCourseInfo);
router.get('/course/:courseId', ctrl.getByCourse);
router.get('/:courseId/:type', ctrl.getByCourseAndType);

module.exports = router;
