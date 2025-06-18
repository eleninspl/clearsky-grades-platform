const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/reviewController');
const authorize = require('../middleware/authorize');

// Review requests
router.get('/requests', ctrl.getAllReviewRequests);
router.get('/requests/:id', ctrl.getReviewRequestById);
router.post('/requests', ctrl.createReviewRequest);

// Review responses
router.post('/responses', ctrl.createReviewResponse);

// Get review requests for instructor
router.get('/', ctrl.getReviewRequestsByInstructor);

module.exports = router;
