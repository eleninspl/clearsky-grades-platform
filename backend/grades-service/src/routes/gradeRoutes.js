const express = require('express');
const router = express.Router();
const controller = require('../controllers/gradeController');
const authorize = require('../middleware/authorize');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// 🔒 Protected
router.get('/student/:id', authorize(['STUDENT', 'INSTRUCTOR', 'ADMIN']), controller.getGradesByStudent); // view student grades
router.get('/instructor/:id/courses', authorize(['INSTRUCTOR', 'ADMIN']), controller.getCoursesForInstructor); // instructor's courses
router.post('/:type', authorize(['INSTRUCTOR']), upload.single('file'), controller.handleUpload); // upload grades

// 🔓 Public
router.get('/distribution/:courseId/:type', controller.getTotalDistribution); // overall grade distribution
router.get('/distribution/:courseId/:type/q/:question', controller.getQuestionDistribution); // per-question distribution
router.get('/questions/:courseId/:type', controller.getQuestionKeys); // get question keys

module.exports = router;
