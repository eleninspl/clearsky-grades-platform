const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/reviewController');
const authenticateToken = require('../authMiddleware');

router.get('/requests', ctrl.getAllReviewRequests);
router.get('/requests/:id', ctrl.getReviewRequestById);

router.post('/requests', ctrl.createReviewRequest);
router.post('/responses', ctrl.createReviewResponse);

module.exports = router;
