const jwt     = require('jsonwebtoken');
const bcrypt  = require('bcrypt');
const db      = require('../utils/db');
const passport= require('../passport');             // ώστε να έχουμε init

// helper δημιουργίας JWT
function issueToken(user) {
  return jwt.sign(
    { 
      sub: user.id, 
      role: user.role, 
      inst: user.institution_id 
    },
    process.env.JWT_SECRET,
    { expiresIn: '2h' }
  );
}

/* POST /auth/signup         (μόνο STUDENT) */
exports.signup = async (req, res, next) => {
  const { email, password, fullName } = req.body;
  try {
    const exists = await db.query(
      `SELECT 1 FROM clearsky.auth_account WHERE provider='LOCAL' AND provider_uid=$1`,
      [email]
    );
    if (exists.rowCount) return res.status(409).json({ message: 'Exists' });

    const hash = await bcrypt.hash(password, 10);
    const uRes = await db.query(
      `INSERT INTO clearsky.users (username,email,full_name,role,institution_id)
       VALUES ($1,$2,$3,'STUDENT',1) RETURNING *`,
      [email, email, fullName]
    );
    const user = uRes.rows[0];
    await db.query(
      `INSERT INTO clearsky.auth_account (user_id,provider,provider_uid,password_hash,password_salt)
       VALUES ($1,'LOCAL',$2,$3,'')`,
      [user.id, email, hash]
    );
    res.json({ token: issueToken(user) });
  } catch (err) { next(err); }
};

/* POST /auth/login          (LOCAL) */
exports.login = [
  passport.authenticate('local', { session:false }),
  (req,res) => {
    const user = req.user;
    const token = issueToken(user);
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        institution_id: user.institution_id
      }
    });
  }
];

exports.logout = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized: Missing token" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.decode(token);

    if (!decoded?.exp) {
      return res.status(400).json({ error: "Invalid token structure" });
    }

    const expirationTime = new Date(decoded.exp * 1000).toISOString();

    await db.query(
      `INSERT INTO clearsky.blacklisted_tokens (token, expiration)
       VALUES ($1, $2)
       ON CONFLICT (token) DO NOTHING`,
      [token, expirationTime]
    );

    res.status(200).json({ message: "Logged out successfully." });
  } catch (error) {
    console.error("Logout error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};


exports.createUserByRole = async (req, res, next) => {
  const creator = req.user;
  const { email, username, password, role, id } = req.body;

  if (!['INSTRUCTOR', 'INST_REP', 'STUDENT'].includes(role)) {
    return res.sendStatus(400);
  }

  try {
    const hash = await bcrypt.hash(password, 10);
    const inst = creator.institution_id;

    let uRes;
    
    if (role === 'STUDENT' && id) {
      // ✅ Insert with custom id for STUDENT
      uRes = await db.query(
        `INSERT INTO clearsky.users (id, username, email, full_name, role, institution_id)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [id, username, email, username, role, inst]
      );
    } else {
      // ✅ Default insert (auto ID)
      uRes = await db.query(
        `INSERT INTO clearsky.users (username, email, full_name, role, institution_id)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [username, email, username, role, inst]
      );
    }

    await db.query(
      `INSERT INTO clearsky.auth_account (user_id, provider, provider_uid, password_hash)
       VALUES ($1, 'LOCAL', $2, $3)`,
      [uRes.rows[0].id, email, hash]
    );

    res.sendStatus(201);
  } catch (err) {
    next(err);
  }
};


