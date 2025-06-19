const express = require('express');
const router = express.Router();
const { getStudentGrades, getInstructorCourses } = require('../controllers/gradesController');

router.get('/student/:studentId', getStudentGrades);
router.get('/instructor/:instructorId/courses', getInstructorCourses);

module.exports = router;
