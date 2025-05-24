const express = require('express');
const router = express.Router();
const controller = require('../controllers/gradeController');
const authenticateToken = require('../authMiddleware');

router.get('/', controller.getAllGrades);
router.get('/:id', controller.getGradeById);
router.get('/student/:id', controller.getGradesByStudent);
router.post('/', authenticateToken, controller.createGrade);
router.put('/:id', authenticateToken, controller.updateGrade);
router.delete('/:id', authenticateToken, controller.deleteGrade);

module.exports = router;
