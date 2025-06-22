const express = require('express');
const router = express.Router();
const authorize = require('../middleware/authorize');

const {
  getBalance,
  buyCredits,
  consumeCredit,
  getHistory
} = require('../controllers/creditsController');

// GET balance for institution
router.get('/:institutionId/balance', authorize(['ADMIN', 'INST_REP']), getBalance);

// POST to buy credits
router.post('/:institutionId/buy', authorize(['ADMIN', 'INST_REP']), buyCredits);

// GET transaction history
router.get('/:institutionId/history', authorize(['ADMIN', 'INST_REP']), getHistory);

module.exports = router;
