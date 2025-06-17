const express = require('express');
const router = express.Router();
const controller = require('../controllers/gradeController');
const authorize = require('../middleware/authorize');

router.get('/', controller.getAllGrades);
router.get('/:id', controller.getGradeById);
router.get('/student/:id', controller.getGradesByStudent);
router.post('/', controller.createGrade);
router.put('/:id', controller.updateGrade);
router.delete('/:id', controller.deleteGrade);

module.exports = router;
