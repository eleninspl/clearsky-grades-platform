const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const authenticateToken = require('../authMiddleware');

router.get('/', courseController.getAllCourses);
router.get('/:id', courseController.getCourseById);
router.get('/student/:id', courseController.getCoursesForStudent);
router.get('/instructor/:id', courseController.getCoursesForInstructor);
router.post('/', authenticateToken, courseController.createCourse);
router.put('/:id', authenticateToken, courseController.updateCourse);
router.delete('/:id', authenticateToken, courseController.deleteCourse);

module.exports = router;
