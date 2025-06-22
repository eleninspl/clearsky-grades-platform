const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { initConsumer } = require('./rabbitmq');
const gradeRoutes = require('./routes/gradeRoutes');

const app = express();
app.use(cors());
app.use(express.json());

console.log('🐇 RABBITMQ_URL:', process.env.RABBITMQ_URL);

app.get('/', (_, res) => res.send('Grades service running 📝'));
app.use('/grades', gradeRoutes);

const PORT = process.env.PORT || 5004;
app.listen(PORT, async () => {
  console.log(`📘 Grades service listening on ${PORT}`);
  await initConsumer();
});
