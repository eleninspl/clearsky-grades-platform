const express = require('express');
const cors = require('cors');
require('dotenv').config();

const reviewRoutes = require('./routes/reviewRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (_, res) => res.send('Review service running 📝'));
app.use('/review', reviewRoutes);

const PORT = process.env.PORT || 5006;
app.listen(PORT, () => console.log(`📝 Review service on port ${PORT}`));
