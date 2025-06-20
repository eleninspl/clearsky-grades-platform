const express = require('express');
const router = express.Router();
const controller = require('../controllers/institutionController');
const authorize = require('../middleware/authorize');

router.get('/stats', authorize(['INST_REP']), controller.getInstitutionStats);
router.get('/stats/course-list', authorize(['INST_REP']), controller.getCourseListWithInstructors);

router.get('/', controller.getAllInstitutions);
router.get('/:id', controller.getInstitutionById);
router.post('/', controller.createInstitution);
router.put('/:id', controller.updateInstitution);
router.delete('/:id', controller.deleteInstitution);
router.patch('/:id/credits', authorize(['INST_REP', 'ADMIN']), controller.updateCreditsBalance);

module.exports = router;
