const express = require('express');
const cors = require('cors');
require('dotenv').config();
const reviewRoutes = require('./routes/reviewRoutes');

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  // credentials: true
}));

app.use(express.json());

app.get('/', (req, res) => res.send('Review service running 📝'));
app.use('/review', reviewRoutes);

const PORT = process.env.PORT || 5006;
app.listen(PORT, () => {
  console.log(`Review service running on port ${PORT}`);
});
