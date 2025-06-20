const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const {
  getStudentGrades,
  getInstructorCourses,
  handleUpload,
  getQuestionKeys,
  getTotalDistribution,
  getQuestionDistribution
} = require('../controllers/gradesController');

// Υπάρχουσες διαδρομές
router.get('/student/:studentId', getStudentGrades);
router.get('/instructor/:instructorId/courses', getInstructorCourses);
router.post('/:type', upload.single('file'), handleUpload);

// 📊 Νέες διαδρομές για στατιστικά
router.get('/questions/:courseId/:type', getQuestionKeys);
router.get('/distribution/:courseId/:type', getTotalDistribution);
router.get('/distribution/:courseId/:type/q/:question', getQuestionDistribution);

module.exports = router;
