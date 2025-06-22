const express = require('express');
const cors = require('cors');
const passport = require('passport');
require('dotenv').config();
require('./passport');

const authRoutes = require('./routes/authRoutes');
const verifyRoutes = require('./routes/verify');

const app = express();

// ── Middleware ──────────────
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// ── Routes ──────────────────
app.use('/', verifyRoutes);            // e.g. token verification
app.use('/auth', authRoutes);          // login, signup, Google, etc.

// ── Healthcheck ─────────────
app.get('/', (req, res) => {
  res.send('Auth service running 🚀');
});

// ── Start Server ────────────
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🔐 Auth service running on port ${PORT}`);
});
