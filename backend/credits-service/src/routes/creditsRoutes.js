const express = require('express');
const router = express.Router();
const controller = require('../controllers/creditsController');
const authenticateToken = require('../authMiddleware');

// Μπορείς να βάλεις έλεγχο role εδώ αν θέλεις

router.get('/:institutionId', controller.getBalance);
router.post('/:institutionId/buy', authenticateToken, controller.buyCredits);
router.post('/:institutionId/use', authenticateToken, controller.consumeCredit);

module.exports = router;
