const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const axios = require('axios');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5010;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Middleware για έλεγχο JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Παράδειγμα route: προώθηση αιτήματος στο course-service
app.get('/courses', authenticateToken, async (req, res) => {
  try {
    const response = await axios.get(`${process.env.COURSE_SERVICE_URL}/`, {
      headers: { Authorization: req.headers['authorization'] }
    });
    res.json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({ error: 'Orchestrator error', detail: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Orchestrator running on port ${PORT}`);
});
