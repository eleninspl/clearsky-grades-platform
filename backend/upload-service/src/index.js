const express = require('express');
const cors = require('cors');
require('dotenv').config();
const uploadRoutes = require('./routes/uploadRoutes');

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  // credentials: true
}));

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Upload service running 📤');
});

app.use('/upload', uploadRoutes);

const PORT = process.env.PORT || 5009;
app.listen(PORT, () => {
  console.log(`Upload service running on port ${PORT}`);
});
