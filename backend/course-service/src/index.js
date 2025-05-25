const express = require('express');
const cors = require('cors');
require('dotenv').config();
const courseRoutes = require('./routes/courseRoutes');

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  // credentials: true
}));

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Course service running 📚');
});
app.use('/courses', courseRoutes);

const PORT = process.env.PORT || 5005;
app.listen(PORT, () => {
  console.log(`✅ Course service running on port ${PORT}`);
});
