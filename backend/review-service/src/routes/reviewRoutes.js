const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/reviewController');
const authenticateToken = require('../authMiddleware');

router.get('/review-requests', ctrl.getAllReviewRequests);
router.get('/review-requests/:id', ctrl.getReviewRequestById);

router.post('/review-requests', authenticateToken, ctrl.createReviewRequest);
router.post('/review-responses', authenticateToken, ctrl.createReviewResponse);

module.exports = router;
