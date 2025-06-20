const express = require('express');
const router = express.Router();
const controller = require('../controllers/gradeController');
const authorize = require('../middleware/authorize');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// 🔒 Grade CRUD – ADMINs and INSTRUCTORS only
router.get('/grade', authorize(['INSTRUCTOR', 'ADMIN']), controller.getAllGrades);
router.get('/grade/:id', authorize(['INSTRUCTOR', 'ADMIN']), controller.getGradeById);
router.post('/grade', authorize(['INSTRUCTOR']), controller.createGrade);
router.put('/grade/:id', authorize(['INSTRUCTOR']), controller.updateGrade);
router.delete('/grade/:id', authorize(['INSTRUCTOR']), controller.deleteGrade);

// 🔒 View student grades – student can only view their own (handled in controller logic or customize middleware)
router.get('/student/:id', authorize(['STUDENT', 'INSTRUCTOR', 'ADMIN']), controller.getGradesByStudent);

// 🔒 View courses of instructor
router.get('/instructor/:id/courses', authorize(['INSTRUCTOR', 'ADMIN']), controller.getCoursesForInstructor);

// 🔒 Upload routes – INSTRUCTORS only
router.post('/:type', authorize(['INSTRUCTOR']), upload.single('file'), controller.handleUpload);

// 🔓 Public: Grade statistics
router.get('/distribution/:courseId/:type', controller.getTotalDistribution);
router.get('/distribution/:courseId/:type/q/:question', controller.getQuestionDistribution);
router.get('/questions/:courseId/:type', controller.getQuestionKeys);

module.exports = router;
