const express = require('express');
const router = express.Router();

const {
  getBalance,
  buyCredits,
  consumeCredit,
  getHistory
} = require('../controllers/creditsController');

// GET balance for institution
router.get('/:institutionId/balance', getBalance);

// POST to buy credits
router.post('/:institutionId/buy', buyCredits);

// GET transaction history
router.get('/:institutionId/history', getHistory);

module.exports = router;
