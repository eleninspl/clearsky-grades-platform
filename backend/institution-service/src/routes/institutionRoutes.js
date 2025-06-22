const express = require('express');
const router = express.Router();
const controller = require('../controllers/institutionController');
const authorize = require('../middleware/authorize');

router.get('/stats', authorize(['INST_REP', 'ADMIN']), controller.getInstitutionStats);
router.get('/stats/course-list', authorize(['INST_REP', 'ADMIN']), controller.getCourseListWithInstructors);

module.exports = router;
