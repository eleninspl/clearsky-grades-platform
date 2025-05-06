const express = require('express');
require('dotenv').config();
const reviewRoutes = require('./routes/reviewRoutes');

const app = express();
app.use(express.json());

app.get('/', (req, res) => res.send('Review service running 📝'));
app.use('/', reviewRoutes);

const PORT = process.env.PORT || 5006;
app.listen(PORT, () => {
  console.log(`Review service running on port ${PORT}`);
});
