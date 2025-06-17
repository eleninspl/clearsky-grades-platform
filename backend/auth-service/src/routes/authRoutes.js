// routes/authRoutes.js
const express   = require('express');
const passport  = require('../passport');
const jwt       = require('jsonwebtoken');
const ctrl      = require('../controllers/authController');
const authorize = require('../middleware/authorize');

const router = express.Router();

// ───────────────────────────────────────────
// Local signup / login
router.post('/signup', ctrl.signup);
router.post('/login',  ctrl.login);
router.post('/logout',
  authorize(), // Οποιοσδήποτε αυθεντικοποιημένος χρήστης
  ctrl.logout
);

// ───────────────────────────────────────────
// Google OAuth
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

router.get('/google/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    const token = jwt.sign(
      { sub: req.user.id, role: req.user.role, inst: req.user.institution_id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({ token });
  }
);

// ───────────────────────────────────────────
// User provisioning (admins / institutional reps)
router.post('/users',
  authorize(['ADMIN', 'INST_REP']), // Only admins and institutional reps can create users
  ctrl.createUserByRole
);

// 👉 Εξάγουμε τον router
module.exports = router;
