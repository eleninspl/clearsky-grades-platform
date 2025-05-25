const express = require('express');
const cors = require('cors');
require('dotenv').config();
const statisticsRoutes = require('./routes/statisticsRoutes');

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  // credentials: true
}));

app.use(express.json());

app.get('/', (req, res) => res.send('Statistics service running 📊'));
app.use('/statistics', statisticsRoutes);

const PORT = process.env.PORT || 5007;
app.listen(PORT, () => {
  console.log(`Statistics service running on port ${PORT}`);
});
