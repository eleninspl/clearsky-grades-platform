const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../db');
const passport = require('../passport');
const axios = require('axios');

const USER_SERVICE = process.env.USER_SERVICE_URL;

// ── Token helper ─────────────
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

// ── Signup (STUDENT only) ────
exports.signup = async (req, res, next) => {
  const { email, password, fullName } = req.body;

  try {
    const exists = await db.query(
      `SELECT 1 FROM auth_account WHERE provider='LOCAL' AND provider_uid=$1`,
      [email]
    );
    if (exists.rowCount) return res.status(409).json({ message: 'Exists' });

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

// ── Login ────────────────────
exports.login = [
  passport.authenticate('local', { session: false }),
  (req, res) => {
    const token = issueToken(req.user);
    res.json({ token, user: req.user });
  },
];

// ── Logout ───────────────────
exports.logout = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer '))
      return res.status(401).json({ error: 'Unauthorized: Missing token' });

    const token = authHeader.split(' ')[1];
    const decoded = jwt.decode(token);
    if (!decoded?.exp)
      return res.status(400).json({ error: 'Invalid token structure' });

    const expiration = new Date(decoded.exp * 1000).toISOString();

    await db.query(
      `INSERT INTO blacklisted_tokens (token, expiration)
       VALUES ($1, $2)
       ON CONFLICT (token) DO NOTHING`,
      [token, expiration]
    );

    res.status(200).json({ message: 'Logged out successfully.' });
  } catch (err) {
    console.error('Logout error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ── Create user by role ──────
exports.createUserByRole = async (req, res, next) => {
  const creator = req.user;
  const { email, username, password, role, id, google_email } = req.body;

  if (!['INSTRUCTOR', 'INST_REP', 'STUDENT'].includes(role))
    return res.sendStatus(400);

  try {
    const hash = await bcrypt.hash(password, 10);
    const fullname = username;
    const inst = creator.institution_id;

    let userResult;
    if (role === 'STUDENT' && id) {
      userResult = await db.query(
        `INSERT INTO users (username, email, full_name, role, institution_id, am, google_email)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING *`,
        [username, email, fullname, role, inst, parseInt(id), google_email || null]
      );
    } else {
      userResult = await db.query(
        `INSERT INTO users (username, email, full_name, role, institution_id, google_email)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [username, email, fullname, role, inst, google_email || null]
      );
    }

    const user = userResult.rows[0];

    await db.query(
      `INSERT INTO auth_account (user_id, provider, provider_uid, password_hash)
       VALUES ($1, 'LOCAL', $2, $3)`,
      [user.id, email, hash]
    );

    if (google_email) {
      await db.query(
        `INSERT INTO auth_account (user_id, provider, provider_uid)
         VALUES ($1, 'GOOGLE', $2)
         ON CONFLICT DO NOTHING`,
        [user.id, google_email]
      );
      console.log(`🔗 Google account linked: ${google_email}`);
    }

    console.log(`✅ Created ${role} user: ${username} (ID: ${user.id})`);
    res.status(201).json(user);
  } catch (err) {
    console.error('Create user error:', err.message);
    next(err);
  }
};

// ── Verify Google login ──────
exports.verifyGoogle = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Missing email' });

  try {
    const userResult = await db.query(
      `SELECT * FROM users WHERE google_email = $1`,
      [email]
    );
    if (!userResult.rowCount)
      return res.status(404).json({
        error: 'No account found. Contact your institution.',
        email,
      });

    const user = userResult.rows[0];

    const authResult = await db.query(
      `SELECT * FROM auth_account WHERE user_id = $1 AND provider = 'GOOGLE'`,
      [user.id]
    );

    if (!authResult.rowCount) {
      await db.query(
        `INSERT INTO auth_account (user_id, provider, provider_uid)
         VALUES ($1, 'GOOGLE', $2)
         ON CONFLICT DO NOTHING`,
        [user.id, email]
      );
      console.log(`🔗 Linked Google account: ${email}`);
    }

    res.status(200).json({ token: issueToken(user), user });
  } catch (err) {
    console.error('verifyGoogle error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ── Verify id_token from frontend ─
exports.verifyGoogleIdToken = async (req, res) => {
  const { email, id_token } = req.body;
  if (!email || !id_token)
    return res.status(400).json({ error: 'Missing email or id_token' });

  try {
    console.log(`🔍 Verifying id_token for: ${email}`);

    const userResult = await db.query(
      `SELECT * FROM users WHERE google_email = $1`,
      [email]
    );
    if (!userResult.rowCount)
      return res.status(404).json({
        error: 'No account found. Contact your institution.',
        email,
      });

    const user = userResult.rows[0];

    const authResult = await db.query(
      `SELECT * FROM auth_account WHERE user_id = $1 AND provider = 'GOOGLE'`,
      [user.id]
    );

    if (!authResult.rowCount) {
      await db.query(
        `INSERT INTO auth_account (user_id, provider, provider_uid)
         VALUES ($1, 'GOOGLE', $2)
         ON CONFLICT DO NOTHING`,
        [user.id, email]
      );
      console.log(`🔗 Linked Google account: ${email}`);
    }

    res.status(200).json({ token: issueToken(user), user });
  } catch (err) {
    console.error('verifyGoogleIdToken error:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ── Google OAuth callback ────
exports.googleOAuthCallback = (req, res, next) => {
  passport.authenticate('google', { session: false }, (err, user, info) => {
    if (err) {
      console.error('OAuth error:', err);
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=server_error`);
    }

    if (!user) {
      const message = encodeURIComponent(info?.message || 'Authentication failed');
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed&message=${message}`);
    }

    try {
      const token = jwt.sign(
        {
          sub: user.id,
          full_name: user.full_name,
          role: user.role,
          inst: user.institution_id,
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      res.redirect(`${process.env.FRONTEND_URL}/auth/google/success?token=${token}`);
    } catch (tokenErr) {
      console.error('Token error:', tokenErr);
      res.redirect(`${process.env.FRONTEND_URL}/login?error=token_error`);
    }
  })(req, res, next);
};
