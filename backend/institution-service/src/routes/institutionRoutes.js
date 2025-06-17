const express = require('express');
const router = express.Router();
const controller = require('../controllers/institutionController');
const authorize = require('../middleware/authorize');

router.get('/', controller.getAllInstitutions);
router.get('/:id', controller.getInstitutionById);
router.post('/', controller.createInstitution);
router.put('/:id', controller.updateInstitution);
router.delete('/:id', controller.deleteInstitution);

module.exports = router;
