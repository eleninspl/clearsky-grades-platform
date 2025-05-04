const express = require('express');
const pool = require('./db');
require('dotenv').config();

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Institution service running 🏛️');
});

app.post('/institutions', async (req, res) => {
  const { name, email } = req.body;

  try {
    const exists = await pool.query(
      'SELECT * FROM clearsky.institution WHERE email = $1',
      [email]
    );

    if (exists.rows.length > 0) {
      return res.status(409).json({ error: 'Institution already exists' });
    }

    const result = await pool.query(
      `INSERT INTO clearsky.institution (name, email)
       VALUES ($1, $2)
       RETURNING *`,
      [name, email]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('DB Error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

const PORT = process.env.PORT || 5003;
app.listen(PORT, () => {
  console.log(`Institution service running on port ${PORT}`);
});
