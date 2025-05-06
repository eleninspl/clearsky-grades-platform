const express = require('express');
require('dotenv').config();
const userRoutes = require('./routes/userRoutes');

const app = express();

app.get('/', (req, res) => {
  res.send('User service running 👤');
});

app.use('/', userRoutes);

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`User service running on port ${PORT}`);
});
