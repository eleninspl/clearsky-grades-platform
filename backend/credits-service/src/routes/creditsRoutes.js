const express = require('express');
const router = express.Router();
const authorize = require('../middleware/authorize');

const creditsController = require('../controllers/creditsController');

router.get('/:institutionId/balance', authorize(['ADMIN', 'INST_REP', 'INSTRUCTOR']), creditsController.getBalance);
router.post('/:institutionId/buy', authorize(['ADMIN', 'INST_REP']), creditsController.buyCredits);
router.get('/:institutionId/history', authorize(['ADMIN', 'INST_REP']), creditsController.getHistory);

module.exports = router;
