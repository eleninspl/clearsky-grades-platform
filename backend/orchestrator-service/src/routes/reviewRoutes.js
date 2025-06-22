const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/reviewController');

router.post('/requests', ctrl.createReviewRequest);
router.get('/instructor', ctrl.getReviewRequestsByInstructor);
router.post('/responses', ctrl.createReviewResponse);
router.get('/status', ctrl.getReviewStatusForStudent);
router.get('/requests/student/:studentId', ctrl.getReviewRequestsForStudent);


module.exports = router;
