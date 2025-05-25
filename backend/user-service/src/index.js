const express = require('express');
const cors = require('cors');
require('dotenv').config();
const userRoutes = require('./routes/userRoutes');

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  // credentials: true
}));

app.get('/', (req, res) => {
  res.send('User service running 👤');
});

app.use('/me', userRoutes);

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`User service running on port ${PORT}`);
});
