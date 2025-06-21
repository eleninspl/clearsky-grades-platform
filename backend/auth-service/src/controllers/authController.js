const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../utils/db');
const passport = require('../passport');
const axios = require('axios');

const USER_SERVICE = process.env.USER_SERVICE_URL;

function issueToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      full_name: user.full_name,
      role: user.role,
      inst: user.institution_id,
    },
    process.env.JWT_SECRET,
    { expiresIn: '2h' }
  );
}

/* POST /auth/signup         (μόνο STUDENT) */
exports.signup = async (req, res, next) => {
  const { email, password, fullName } = req.body;
  try {
    // check if already exists
    const exists = await db.query(
      `SELECT 1 FROM auth_account WHERE provider='LOCAL' AND provider_uid=$1`,
      [email]
    );
    if (exists.rowCount) return res.status(409).json({ message: 'Exists' });

    // create user remotely
    const userRes = await axios.post(`${USER_SERVICE}/users`, {
      username: email,
      email,
      full_name: fullName,
      role: 'STUDENT',
    });

    const user = userRes.data;

    const hash = await bcrypt.hash(password, 10);
    await db.query(
      `INSERT INTO auth_account (user_id, provider, provider_uid, password_hash)
       VALUES ($1, 'LOCAL', $2, $3)`,
      [user.id, email, hash]
    );

    res.json({ token: issueToken(user) });
  } catch (err) {
    next(err);
  }
};

// GET /auth/users/:id
exports.getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(`SELECT * FROM users WHERE id = $1`, [id]);

    if (result.rows.length === 0)
      return res.status(404).json({ error: 'User not found' });

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Get User by ID Error:', err.message);
    res.status(500).json({ error: 'Database error' });
  }
};


/* POST /auth/login */
exports.login = [
  passport.authenticate('local', { session: false }),
  (req, res) => {
    const user = req.user;
    const token = issueToken(user);
    res.json({ token, user });
  },
];

exports.logout = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer '))
      return res.status(401).json({ error: 'Unauthorized: Missing token' });

    const token = authHeader.split(' ')[1];
    const decoded = jwt.decode(token);

    if (!decoded?.exp)
      return res.status(400).json({ error: 'Invalid token structure' });

    const expirationTime = new Date(decoded.exp * 1000).toISOString();

    await db.query(
      `INSERT INTO blacklisted_tokens (token, expiration)
       VALUES ($1, $2)
       ON CONFLICT (token) DO NOTHING`,
      [token, expirationTime]
    );

    res.status(200).json({ message: 'Logged out successfully.' });
  } catch (error) {
    console.error('Logout error:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// controllers/authController.js

exports.createUserByRole = async (req, res, next) => {
  const creator = req.user;
  const { email, username, password, role, id } = req.body;

  // Έλεγχος έγκυρου role
  if (!['INSTRUCTOR', 'INST_REP', 'STUDENT'].includes(role)) {
    return res.sendStatus(400);
  }

  try {
    // 1) Hash του password
    const hash = await bcrypt.hash(password, 10);
    const inst = creator.institution_id;
    const fullname = username;

    // 2) Εισαγωγή στον πίνακα users (μέσα στο authdb schema)
    let userResult;
    if (id) {
      userResult = await db.query(
        `INSERT INTO users
           (id, username, email, full_name, role, institution_id)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [id, username, email, fullname, role, inst]
      );
    } else {
      userResult = await db.query(
        `INSERT INTO users
           (username, email, full_name, role, institution_id)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [username, email, fullname, role, inst]
      );
    }
    const user = userResult.rows[0];

    // 3) Εισαγωγή στον πίνακα auth_account
    await db.query(
      `INSERT INTO auth_account
         (user_id, provider, provider_uid, password_hash)
       VALUES ($1, 'LOCAL', $2, $3)`,
      [user.id, email, hash]
    );

    // 4) Επιστροφή του νέου χρήστη
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};


// ✅ Google login verification
exports.verifyGoogle = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Missing email' });
  }

  try {
    const result = await db.query(
      `
      SELECT u.id, u.email, u.role, u.full_name, u.institution_id
      FROM users u
      JOIN auth_account a ON a.user_id = u.id
      WHERE a.provider = 'GOOGLE'
        AND a.provider_uid = $1
        AND u.role = 'STUDENT'
      `,
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found or not a student' });
    }

    const user = result.rows[0];
    const token = issueToken(user);

    res.status(200).json({ token });
  } catch (err) {
    console.error('verifyGoogle failed:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};
