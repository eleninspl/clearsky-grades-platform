const express = require('express');
const cors = require('cors'); 
require('dotenv').config();

const creditRoutes = require('./routes/creditsRoutes'); // ✅ Αυτό είναι σωστό

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  // credentials: true // αν χρειαστεί
}));

app.use(express.json());

app.get('/', (req, res) => res.send('Credits service running '));

// Χρήση routes
app.use('/credits', creditRoutes);

const PORT = process.env.PORT || 5008;
app.listen(PORT, () => {
  console.log(`✅ Credits service running on port ${PORT}`);
});
