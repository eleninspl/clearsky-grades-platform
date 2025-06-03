const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/statisticsController');

router.get('/distribution/:courseId', ctrl.getTotalDistribution);
router.get('/distribution/:courseId/q/:question', ctrl.getQuestionDistribution);

router.get('/', ctrl.getAll);
router.post('/recalculate/:courseId/:type', ctrl.recalculateStatistics);
router.get('/details/:courseId/:type', ctrl.getWithCourseInfo);
router.get('/course/:courseId', ctrl.getByCourse);
router.get('/:courseId/:type', ctrl.getByCourseAndType); // κρατάμε το πιο γενικό τελευταίο

module.exports = router;
