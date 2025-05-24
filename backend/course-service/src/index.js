const express = require('express');
const cors = require('cors');
require('dotenv').config();
const gradeRoutes = require('./routes/gradeRoutes');

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  // credentials: true
}));

app.use(express.json());

app.get('/', (req, res) => res.send('Grades service running 📝'));
app.use('/grades', gradeRoutes);

const PORT = process.env.PORT || 5004;
app.listen(PORT, () => {
  console.log(`Grades service running on port ${PORT}`);
});
