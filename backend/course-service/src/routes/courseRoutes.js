const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const authorize = require('../middleware/authorize');

// 🔐 Μόνο εξουσιοδοτημένοι χρήστες (οποιοσδήποτε logged in)
router.get('/', authorize(), courseController.getAllCourses);
router.get('/:id', authorize(), courseController.getCourseById);
router.get('/student/:id', authorize(['STUDENT']), courseController.getCoursesForStudent);

// 🔐 Μόνο instructor μπορεί να δει τα δικά του
router.get('/instructor/:id', authorize(['INSTRUCTOR']), courseController.getCoursesForInstructor);

// 🔐 Μόνο institution representative ή instructor μπορεί να δημιουργήσει
router.post('/', authorize(['INST_REP', 'INSTRUCTOR']), courseController.createCourse);

// 🔐 Μόνο instructor μπορεί να επεξεργαστεί ή να διαγράψει
router.put('/:id', authorize(['INSTRUCTOR']), courseController.updateCourse);
router.delete('/:id', authorize(['INSTRUCTOR']), courseController.deleteCourse);

module.exports = router;
