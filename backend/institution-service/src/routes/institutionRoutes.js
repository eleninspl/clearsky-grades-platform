const express = require('express');
const router = express.Router();
const controller = require('../controllers/institutionController');
const authorize = require('../middleware/authorize');

router.get('/stats', authorize(['INST_REP', 'ADMIN']), controller.getInstitutionStats);
router.get('/stats/course-list', authorize(['INST_REP', 'ADMIN']), controller.getCourseListWithInstructors);

// router.get('/', authorize(['INST_REP', 'ADMIN']),controller.getAllInstitutions);
// router.get('/:id', authorize(['INST_REP', 'ADMIN']),controller.getInstitutionById);
// router.post('/', authorize(['INST_REP', 'ADMIN']),controller.createInstitution);
// router.put('/:id', authorize(['INST_REP', 'ADMIN']),controller.updateInstitution);
// router.delete('/:id', authorize(['INST_REP', 'ADMIN']),controller.deleteInstitution);
// router.patch('/:id/credits', authorize(['INST_REP', 'ADMIN']), controller.updateCreditsBalance);

module.exports = router;
