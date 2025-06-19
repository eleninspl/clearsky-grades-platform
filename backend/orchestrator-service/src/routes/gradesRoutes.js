const express = require('express');
const router = express.Router();
const { getStudentGrades } = require('../controllers/gradesController');

router.get('/student/:studentId', getStudentGrades);

module.exports = router;
