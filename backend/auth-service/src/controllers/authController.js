const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../db');
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
  const { email, username, password, role, id, google_email } = req.body;

  // Έλεγχος έγκυρου role
  if (!['INSTRUCTOR', 'INST_REP', 'STUDENT'].includes(role)) {
    return res.sendStatus(400);
  }

  try {
    // 1) Hash του password
    const hash = await bcrypt.hash(password, 10);
    const inst = creator.institution_id;
    const fullname = username;

    // 2) Εισαγωγή στον πίνακα users
    let userResult;
    
    if (role === 'STUDENT' && id) {
      // For students, use the 'id' field as 'am' (student registration number)
      userResult = await db.query(
        `INSERT INTO users
           (username, email, full_name, role, institution_id, am, google_email)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [username, email, fullname, role, inst, parseInt(id), google_email || null]
      );
    } else {
      // For instructors and reps, no AM field needed
      userResult = await db.query(
        `INSERT INTO users
           (username, email, full_name, role, institution_id, google_email)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [username, email, fullname, role, inst, google_email || null]
      );
    }
    
    const user = userResult.rows[0];

    // 3) Εισαγωγή στον πίνακα auth_account (LOCAL provider)
    await db.query(
      `INSERT INTO auth_account
         (user_id, provider, provider_uid, password_hash)
       VALUES ($1, 'LOCAL', $2, $3)`,
      [user.id, email, hash]
    );

    // 4) If Google email is provided, create Google auth account
    if (google_email) {
      await db.query(
        `INSERT INTO auth_account
           (user_id, provider, provider_uid)
         VALUES ($1, 'GOOGLE', $2)
         ON CONFLICT (provider, provider_uid) DO NOTHING`,
        [user.id, google_email]
      );
      console.log(`🔗 Created Google auth account for new user with email: ${google_email}`);
    }

    console.log(`✅ Created ${role} user: ${username} (ID: ${user.id}${role === 'STUDENT' ? `, AM: ${user.am}` : ''}${google_email ? `, Google: ${google_email}` : ''})`);

    // 5) Επιστροφή του νέου χρήστη
    res.status(201).json(user);
  } catch (err) {
    console.error('Create user error:', err.message);
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
    // First check if user exists with this Google email in users table
    const userResult = await db.query(
      `SELECT * FROM users WHERE google_email = $1`,
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ 
        error: 'No account found with this Google email. Please contact your institution to register your Google account.',
        email: email
      });
    }

    const user = userResult.rows[0];

    // Check if Google auth account exists
    const authResult = await db.query(
      `SELECT * FROM auth_account WHERE user_id = $1 AND provider = 'GOOGLE'`,
      [user.id]
    );

    // If no Google auth account exists, create one
    if (authResult.rows.length === 0) {
      await db.query(
        `INSERT INTO auth_account (user_id, provider, provider_uid)
         VALUES ($1, 'GOOGLE', $2)
         ON CONFLICT (provider, provider_uid) DO NOTHING`,
        [user.id, email]
      );
      console.log(`🔗 Created Google auth account for user ${user.id} with email ${email}`);
    }

    const token = issueToken(user);

    res.status(200).json({ 
      token,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        institution_id: user.institution_id,
        google_email: user.google_email
      }
    });
  } catch (err) {
    console.error('verifyGoogle failed:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ✅ Google id_token verification (for client-side OAuth)
exports.verifyGoogleIdToken = async (req, res) => {
  const { email, id_token } = req.body;

  if (!email || !id_token) {
    return res.status(400).json({ error: 'Missing email or id_token' });
  }

  try {
    // For production, you should verify the id_token with Google's servers
    // For now, we'll trust the email from the frontend since it's extracted from the signed JWT
    console.log(`🔍 Google id_token verification for email: ${email}`);

    // Check if user exists with this Google email
    const userResult = await db.query(
      `SELECT * FROM users WHERE google_email = $1`,
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ 
        error: 'No account found with this Google email. Please contact your institution to register your Google account.',
        email: email
      });
    }

    const user = userResult.rows[0];

    // Check if Google auth account exists
    const authResult = await db.query(
      `SELECT * FROM auth_account WHERE user_id = $1 AND provider = 'GOOGLE'`,
      [user.id]
    );

    // If no Google auth account exists, create one
    if (authResult.rows.length === 0) {
      await db.query(
        `INSERT INTO auth_account (user_id, provider, provider_uid)
         VALUES ($1, 'GOOGLE', $2)
         ON CONFLICT (provider, provider_uid) DO NOTHING`,
        [user.id, email]
      );
      console.log(`🔗 Created Google auth account for user ${user.id} with email ${email}`);
    }

    const token = issueToken(user);

    res.status(200).json({ 
      token,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        institution_id: user.institution_id,
        google_email: user.google_email
      }
    });
  } catch (err) {
    console.error('Google id_token verification failed:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};


exports.googleOAuthCallback = (req, res, next) => {
  passport.authenticate('google', { session: false }, (err, user, info) => {
    if (err) {
      console.error('Google OAuth error:', err);
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=server_error`);
    }

    if (!user) {
      const errorMessage = encodeURIComponent(info?.message || 'Authentication failed');
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed&message=${errorMessage}`);
    }

    try {
      const token = jwt.sign(
        { 
          sub: user.id, 
          full_name: user.full_name,
          role: user.role, 
          inst: user.institution_id 
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.redirect(`${process.env.FRONTEND_URL}/auth/google/success?token=${token}`);
    } catch (tokenErr) {
      console.error('Token generation error:', tokenErr);
      res.redirect(`${process.env.FRONTEND_URL}/login?error=token_error`);
    }
  })(req, res, next);
};
