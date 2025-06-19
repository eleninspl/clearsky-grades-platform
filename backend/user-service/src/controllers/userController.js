const pool = require('../db');

// Δημιουργία νέου χρήστη
exports.createUser = async (req, res) => {
  const { id, username, email, full_name, role, institution_id = 1 } = req.body;

  try {
    let result;

    if (id) {
      result = await pool.query(
        `INSERT INTO users (id, username, email, full_name, role, institution_id)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [id, username, email, full_name, role, institution_id]
      );
    } else {
      result = await pool.query(
        `INSERT INTO users (username, email, full_name, role, institution_id)
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [username, email, full_name, role, institution_id]
      );
    }

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Create User Error:', err.message);
    res.status(500).json({ error: 'Database error' });
  }
};

// GET /users/:id
exports.getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);

    if (result.rows.length === 0)
      return res.status(404).json({ error: 'User not found' });

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Get User by ID Error:', err.message);
    res.status(500).json({ error: 'Database error' });
  }
};

// GET /users?email=...
exports.getUserByEmail = async (req, res) => {
  const { email } = req.query;

  if (!email) return res.status(400).json({ error: 'Missing email' });

  try {
    const result = await pool.query(`SELECT * FROM users WHERE email = $1`, [email]);

    if (result.rows.length === 0)
      return res.status(404).json({ error: 'User not found' });

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Get User by Email Error:', err.message);
    res.status(500).json({ error: 'Database error' });
  }
};
