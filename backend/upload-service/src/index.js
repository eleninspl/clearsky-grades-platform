const express = require('express');
require('dotenv').config();
const creditRoutes = require('./routes/uploadRoutes');

const app = express();
app.use(express.json());

app.get('/', (req, res) => res.send('Credits service running 💰'));
app.use('/credits', creditRoutes);

const PORT = process.env.PORT || 5008;
app.listen(PORT, () => {
  console.log(`Credits service running on port ${PORT}`);
});
