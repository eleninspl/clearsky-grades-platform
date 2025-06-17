const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const authorize = require('../middleware/authorize');

router.get('/', courseController.getAllCourses);
router.get('/:id', courseController.getCourseById);
router.get('/student/:id', courseController.getCoursesForStudent);
router.get('/instructor/:id', courseController.getCoursesForInstructor);
router.post('/', courseController.createCourse);
router.put('/:id', courseController.updateCourse);
router.delete('/:id', courseController.deleteCourse);

module.exports = router;
