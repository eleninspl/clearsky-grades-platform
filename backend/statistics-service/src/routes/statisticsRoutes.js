const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/statisticsController');
const authorize = require('../middleware/authorize');

router.get('/questions/:courseId', ctrl.getQuestionKeys);
router.get('/distribution/:courseId', ctrl.getTotalDistribution);
router.get('/distribution/:courseId/q/:question', ctrl.getQuestionDistribution);

router.get('/', ctrl.getAll);
router.post('/recalculate/:courseId/:type', ctrl.recalculateStatistics);
router.get('/details/:courseId/:type', ctrl.getWithCourseInfo);
router.get('/course/:courseId', ctrl.getByCourse);
router.get('/:courseId/:type', ctrl.getByCourseAndType);



module.exports = router;
