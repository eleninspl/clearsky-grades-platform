const express = require('express');
const authenticateToken = require('./authMiddleware');
require('dotenv').config();

const app = express();

app.get('/', (req, res) => {
  res.send('User service running 👤');
});

app.get('/me', authenticateToken, (req, res) => {
  res.json({
    message: 'Authenticated user',
    user: req.user
  });
});

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`User service running on port ${PORT}`);
});
