const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/reviewController');
const authorize = require('../middleware/authorize');

// 🔽 GET routes
router.get('/instructor', authorize(['INSTRUCTOR', 'ADMIN', 'INST_REP']), ctrl.getReviewRequestsByInstructor); // instructor view
router.get('/status', authorize(['STUDENT', 'INSTRUCTOR', 'ADMIN', 'INST_REP']), ctrl.getReviewStatusForStudent); // status overview
router.get('/requests/student/:studentId', authorize(['STUDENT', 'ADMIN', 'INSTRUCTOR', 'INST_REP']), ctrl.getReviewRequestsForStudent); // student’s requests

// 🔼 POST routes
router.post('/requests', authorize(['STUDENT', 'ADMIN', 'INST_REP']), ctrl.createReviewRequest); // create request
router.post('/responses', authorize(['INSTRUCTOR', 'ADMIN', 'INST_REP']), ctrl.createReviewResponse); // respond to request

module.exports = router;
