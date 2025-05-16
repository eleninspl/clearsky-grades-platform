const express   = require('express');
const passport  = require('../passport');
const ctrl      = require('../controllers/authController');
const authorize = require('../middleware/authorize');

module.exports = app => {
  const r = express.Router();

  // Local signup/login
  r.post('/signup', ctrl.signup);
  r.post('/login',  ctrl.login);

  // Google OAuth
  r.get('/google', passport.authenticate('google',
        { scope:['profile','email'], session:false }));
  r.get('/google/callback',
        passport.authenticate('google', { session:false }),
        (req,res) => res.json({ token: jwt.sign(
          { sub:req.user.id, role:req.user.role, inst:req.user.institution_id },
          process.env.JWT_SECRET, { expiresIn:'7d' })})
  );

  // User provisioning (teachers / reps)
  r.post('/users', authorize(['ADMIN','INST_REP']), ctrl.createUserByRole);

  app.use('/auth', r);
};
