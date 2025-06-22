const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/reviewController');
const authorize = require('../middleware/authorize');

// Routes
router.post('/requests', authorize(['STUDENT', 'ADMIN', 'INST_REP']), ctrl.createReviewRequest);
// router.get('/requests', authorize(['INSTRUCTOR', 'INST_REP', 'ADMIN']), ctrl.getAllReviewRequests);
router.get('/instructor', authorize(['INSTRUCTOR', 'ADMIN', 'INST_REP']), ctrl.getReviewRequestsByInstructor);
router.post('/responses', authorize(['INSTRUCTOR', 'ADMIN', 'INST_REP']), ctrl.createReviewResponse);
router.get('/status', authorize(['STUDENT', 'INSTRUCTOR', 'ADMIN', 'INST_REP']), ctrl.getReviewStatusForStudent);
router.get('/requests/student/:studentId', authorize(['STUDENT', 'ADMIN', 'INSTRUCTOR', 'INST_REP']), ctrl.getReviewRequestsForStudent);

module.exports = router;
