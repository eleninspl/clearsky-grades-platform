const express = require('express');
const cors = require('cors');
const passport = require('passport');
require('dotenv').config();
require('./passport'); // load strategy

const app = express();
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// Test route
app.get('/', (req, res) => {
  res.send('Auth service running 🚀');
});

// Step 1: Redirect user to Google login
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Step 2: Callback from Google
app.get('/auth/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/' }),
  (req, res) => {
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({
      id: req.user.id,
      name: req.user.displayName,
      email: req.user.emails[0].value,
    }, process.env.JWT_SECRET);

    res.send(`✅ Login success!<br><br>Your token:<br><code>${token}</code>`);
  }
);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Auth service running on port ${PORT}`);
});
