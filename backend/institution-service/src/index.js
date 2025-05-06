const express = require('express');
require('dotenv').config();
const institutionRoutes = require('./routes/institutionRoutes');

const app = express();
app.use(express.json());

app.get('/', (req, res) => res.send('Institution service running 🏛️'));
app.use('/institutions', institutionRoutes);

const PORT = process.env.PORT || 5003;
app.listen(PORT, () => {
  console.log(`Institution service running on port ${PORT}`);
});
