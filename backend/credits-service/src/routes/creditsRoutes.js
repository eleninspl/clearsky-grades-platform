const express = require('express');
const app = express();
const creditsRoutes = require('./routes/creditsRoutes');

app.use(express.json());

// Σύνδεση του route base path
app.use('/credits', creditsRoutes);

const PORT = process.env.PORT || 5003;
app.listen(PORT, () => {
  console.log(`Credits service running on port ${PORT}`);
});
