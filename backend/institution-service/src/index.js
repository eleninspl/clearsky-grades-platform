const express = require('express');
const cors = require('cors');
require('dotenv').config();

const institutionRoutes = require('./routes/institutionRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (_, res) => res.send('Institution service running 🏛️'));
app.use('/institutions', institutionRoutes);

const PORT = process.env.PORT || 5003;
app.listen(PORT, () => console.log(`🏛️ Institution service on port ${PORT}`));
