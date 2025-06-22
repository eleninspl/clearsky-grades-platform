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

<<<<<<< Updated upstream
const { initRabbit } = require('./rabbitmq');

// Middleware
app.use(cors());
=======
const allowedOrigins = [
  'http://localhost:5173',
  'http://192.168.2.7:5173',
  'http://147.102.1.55:5173'  // βάλε εδώ όποια IP έχει το μηχάνημά σου
  // μπορείς να βάλεις και άλλες, π.χ. του εργαστηρίου
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


>>>>>>> Stashed changes
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/grades', gradesRoutes);
app.use('/auth', authRoutes);
app.use('/institutions', institutionRoutes);
app.use('/review', reviewRoutes);
app.use('/credits', creditsRoutes);

// Test route (προαιρετικό)
app.get('/', (req, res) => {
  res.send('🟢 Orchestrator service is running');
});

app.listen(PORT, async () => {
  console.log(`✅ Orchestrator listening on port ${PORT}`);
  await initRabbit(); // 🔁 Init RabbitMQ όταν ξεκινάει
});
