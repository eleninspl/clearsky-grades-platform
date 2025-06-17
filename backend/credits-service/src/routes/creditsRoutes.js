const express = require('express');
const router = express.Router();
const controller = require('../controllers/creditsController');
const authorize = require('../middleware/authorize');

// Μπορείς να βάλεις έλεγχο role εδώ αν θέλεις

router.get('/:institutionId', authorize(['ADMIN', 'INST_REP']), controller.getBalance);
router.post('/:institutionId/buy', authorize(['ADMIN', 'INST_REP']), controller.buyCredits);
router.post('/:institutionId/use', authorize(['ADMIN', 'INST_REP']), controller.consumeCredit);

router.get('/:institutionId/history', authorize(['ADMIN', 'INST_REP']), controller.getHistory);
module.exports = router;
