const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/institutionController');

// Public or Admin access
router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getById);
router.post('/', ctrl.create);
router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);

// Protected (requires Authorization header)
router.patch('/:id/credits', ctrl.updateCredits);
router.get('/stats', ctrl.getStats);
router.get('/stats/course-enrollment', ctrl.getCourseEnrollment);

module.exports = router;
