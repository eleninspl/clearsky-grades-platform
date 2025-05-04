const express = require('express');
const authenticateToken = require('./authMiddleware');
const pool = require('./db');
require('dotenv').config();

const app = express();

app.get('/', (req, res) => {
  res.send('User service running 👤');
});

app.get('/me', authenticateToken, async (req, res) => {
  const { email, name, id: googleId } = req.user;

  try {
    // Βρες τον χρήστη από το email
    const userQuery = await pool.query('SELECT * FROM clearsky.users WHERE email = $1', [email]);

    // Αν υπάρχει ήδη
    if (userQuery.rows.length > 0) {
      return res.json({ user: userQuery.rows[0] });
    }

    // Αν ΔΕΝ υπάρχει → δημιούργησέ τον (π.χ. ως STUDENT, inst_id=1 προσωρινά)
    const createUser = await pool.query(`
      INSERT INTO clearsky.users (username, email, full_name, role, institution_id)
      VALUES ($1, $2, $3, 'STUDENT', 1)
      RETURNING *;
    `, [email.split('@')[0], email, name]);

    const newUser = createUser.rows[0];

    // Εισαγωγή στο auth_account (για Google login)
    await pool.query(`
      INSERT INTO clearsky.auth_account (user_id, provider, provider_uid)
      VALUES ($1, 'GOOGLE', $2);
    `, [newUser.id, googleId]);

    return res.status(201).json({ user: newUser });

  } catch (err) {
    console.error('DB Error:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`User service running on port ${PORT}`);
});
