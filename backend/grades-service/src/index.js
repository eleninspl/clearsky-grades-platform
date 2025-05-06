const express = require('express');
require('dotenv').config();
const gradeRoutes = require('./routes/gradeRoutes');

const app = express();
app.use(express.json());

app.get('/', (req, res) => res.send('Grades service running 🎓'));
app.use('/grades', gradeRoutes);

const PORT = process.env.PORT || 5004;
app.listen(PORT, () => {
  console.log(`Grades service running on port ${PORT}`);
});
