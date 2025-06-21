const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/reviewController');

// Routes
router.post('/requests', ctrl.createReviewRequest);
router.get('/requests', ctrl.getAllReviewRequests);
router.get('/instructor', ctrl.getReviewRequestsByInstructor);
router.post('/responses', ctrl.createReviewResponse);
router.get('/status', ctrl.getReviewStatusForStudent);
router.get('/requests/student/:studentId', ctrl.getReviewRequestsForStudent);

module.exports = router;
