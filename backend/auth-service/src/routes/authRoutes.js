// routes/authRoutes.js
const express   = require('express');
const passport  = require('../passport');
const jwt       = require('jsonwebtoken');
const ctrl      = require('../controllers/authController');
const authorize = require('../middleware/authorize');

const router = express.Router();

// ───────────────────────────────────────────
// Local signup / login
router.post('/verify-google', ctrl.verifyGoogle);
router.post('/verify-google-token', ctrl.verifyGoogleIdToken);
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
  (req, res, next) => {
    passport.authenticate('google', { session: false }, (err, user, info) => {
      if (err) {
        console.error('Google OAuth error:', err);
        return res.redirect(`${process.env.FRONTEND_URL}/login?error=server_error`);
      }
      
      if (!user) {
        console.log('Google OAuth failed:', info?.message || 'No user returned');
        const errorMessage = encodeURIComponent(info?.message || 'Authentication failed');
        return res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed&message=${errorMessage}`);
      }

      try {
        const token = jwt.sign(
          { 
            sub: user.id, 
            full_name: user.full_name,
            role: user.role, 
            inst: user.institution_id 
          },
          process.env.JWT_SECRET,
          { expiresIn: '7d' }
        );
        
        console.log(`✅ Google OAuth success for user: ${user.email} (${user.role})`);
        
        // Redirect to frontend with token
        res.redirect(`${process.env.FRONTEND_URL}/auth/google/success?token=${token}`);
      } catch (tokenErr) {
        console.error('Token generation error:', tokenErr);
        res.redirect(`${process.env.FRONTEND_URL}/login?error=token_error`);
      }
    })(req, res, next);
  }
);

router.get('/users/:id', ctrl.getUserById);


// ───────────────────────────────────────────
// User provisioning (admins / institutional reps)
router.post('/users',
  authorize(['ADMIN', 'INST_REP']), // Only admins and institutional reps can create users
  ctrl.createUserByRole
);

// 👉 Εξάγουμε τον router
module.exports = router;