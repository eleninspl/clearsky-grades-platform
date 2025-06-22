const express = require('express');
const cors = require('cors');
require('dotenv').config();
require('./passport');
const authRoutes = require('./routes/authRoutes');

const app = express();
app.use(cors());
app.use(express.json());
app.use(require('passport').initialize());

const verifyRoutes = require('./routes/verify');
app.use('/', verifyRoutes);

// Healthcheck
app.get('/', (req, res) => {
  res.send('Auth service running 🚀');
});

// Routes
app.use('/auth', authRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Auth service running on port ${PORT}`);
});
