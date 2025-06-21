const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/creditsController');

// Forwarded routes
router.get('/:institutionId/balance', ctrl.getBalance);
router.post('/:institutionId/buy', ctrl.buyCredits);
router.get('/:institutionId/history', ctrl.getHistory);

module.exports = router;
