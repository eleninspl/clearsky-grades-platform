const express = require('express');
require('dotenv').config();
const statisticsRoutes = require('./routes/statisticsRoutes');

const app = express();
app.use(express.json());

app.get('/', (req, res) => res.send('Statistics service running 📊'));
app.use('/statistics', statisticsRoutes);

const PORT = process.env.PORT || 5007;
app.listen(PORT, () => {
  console.log(`Statistics service running on port ${PORT}`);
});
