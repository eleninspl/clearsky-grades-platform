const express = require('express');
const router = express.Router();
const controller = require('../controllers/institutionController');
const authenticateToken = require('../authMiddleware');

router.get('/', controller.getAllInstitutions);
router.get('/:id', controller.getInstitutionById);
router.post('/', authenticateToken, controller.createInstitution);
router.put('/:id', authenticateToken, controller.updateInstitution);
router.delete('/:id', authenticateToken, controller.deleteInstitution);

module.exports = router;
