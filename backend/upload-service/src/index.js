const express = require('express');
require('dotenv').config();
const uploadRoutes = require('./routes/uploadRoutes');

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Upload service running 📤');
});

app.use('/', uploadRoutes);

const PORT = process.env.PORT || 5009;
app.listen(PORT, () => {
  console.log(`Upload service running on port ${PORT}`);
});
