const express = require('express');
const cors = require('cors'); 
require('dotenv').config();
const creditRoutes = require('./routes/creditsRoutes');

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  // credentials: true
}));

app.use(express.json());

app.get('/', (req, res) => res.send('Credits service running 💰'));
app.use('/credits', creditRoutes);

const PORT = process.env.PORT || 5008;
app.listen(PORT, () => {
  console.log(`✅ Credits service running on port ${PORT}`);
});
