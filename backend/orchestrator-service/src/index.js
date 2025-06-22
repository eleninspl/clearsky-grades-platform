const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');

const gradesRoutes = require('./routes/gradesRoutes');
const authRoutes = require('./routes/authRoutes');
const institutionRoutes = require('./routes/institutionRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const creditsRoutes = require('./routes/creditsRoutes');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5010;

// ✅ Σωστό import RabbitMQ (modular)
const { initRabbit } = require('./rabbitmq');

// 🔐 Επιτρεπόμενα origins
const allowedOrigins = [
  'http://localhost:5173',
  'http://192.168.2.7:5173',
  'http://147.102.1.55:5173'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(morgan('dev'));

// 📦 Routes
app.use('/grades', gradesRoutes);
app.use('/auth', authRoutes);
app.use('/institutions', institutionRoutes);
app.use('/review', reviewRoutes);
app.use('/credits', creditsRoutes);

// 🔁 Health check route
app.get('/', (req, res) => {
  res.send('🟢 Orchestrator service is running');
});

// 🚀 Server + RabbitMQ
app.listen(PORT, async () => {
  console.log(`✅ Orchestrator listening on port ${PORT}`);
  await initRabbit(); // 🟢 Init RabbitMQ σύνδεση
});
