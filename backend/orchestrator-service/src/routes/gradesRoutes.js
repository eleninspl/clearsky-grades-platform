const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const gradesController = require('../controllers/gradesController');

// 📚 Βασικές διαδρομές
router.get('/student/:studentId', gradesController.getStudentGrades); // fetch grades by student
router.get('/instructor/:instructorId/courses', gradesController.getInstructorCourses); // fetch instructor courses
router.post('/:type', upload.single('file'), gradesController.handleUpload); // upload grades file

// 📊 Στατιστικά βαθμολογιών
router.get('/questions/:courseId/:type', gradesController.getQuestionKeys); // get question keys
router.get('/distribution/:courseId/:type', gradesController.getTotalDistribution); // course distribution
router.get('/distribution/:courseId/:type/q/:question', gradesController.getQuestionDistribution); // per-question stats

module.exports = router;
