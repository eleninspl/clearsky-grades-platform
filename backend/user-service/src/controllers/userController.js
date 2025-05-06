const pool = require('../db');

exports.handleMe = async (req, res) => {
  const { email, name, id: googleId } = req.user;

  try {
    const userQuery = await pool.query('SELECT * FROM clearsky.users WHERE email = $1', [email]);

    if (userQuery.rows.length > 0) {
      return res.json({ user: userQuery.rows[0] });
    }

    const createUser = await pool.query(`
      INSERT INTO clearsky.users (username, email, full_name, role, institution_id)
      VALUES ($1, $2, $3, 'STUDENT', 1)
      RETURNING *;
    `, [email.split('@')[0], email, name]);

    const newUser = createUser.rows[0];

    await pool.query(`
      INSERT INTO clearsky.auth_account (user_id, provider, provider_uid)
      VALUES ($1, 'GOOGLE', $2);
    `, [newUser.id, googleId]);

    return res.status(201).json({ user: newUser });

  } catch (err) {
    console.error('DB Error:', err);
    res.status(500).json({ error: 'Database error' });
  }
};
