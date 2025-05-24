const jwt     = require('jsonwebtoken');
const bcrypt  = require('bcrypt');
const db      = require('../utils/db');
const passport= require('../passport');             // ώστε να έχουμε init

// helper δημιουργίας JWT
function issueToken(user) {
  return jwt.sign(
    { sub: user.id, role: user.role, inst: user.institution_id },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
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
        role: user.role,
        institution_id: user.institution_id
      }
    });
  }
];


/* POST /auth/users          (δημιουργεί INSTRUCTOR ή INST_REP) */
exports.createUserByRole = async (req, res, next) => {
  const creator = req.user;                         // από authorize
  const { email, password, role, institutionId } = req.body;

  // business rules
  if (role === 'INST_REP' && creator.role !== 'ADMIN')      return res.sendStatus(403);
  if (role === 'INSTRUCTOR' && creator.role !== 'INST_REP') return res.sendStatus(403);
  if (!['INSTRUCTOR','INST_REP'].includes(role))            return res.sendStatus(400);

  try {
    const hash = await bcrypt.hash(password, 10);
    const inst = role === 'INSTRUCTOR' ? creator.inst : institutionId;
    const uRes = await db.query(
      `INSERT INTO clearsky.users (username,email,full_name,role,institution_id)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [email, email, email, role, inst]
    );
    await db.query(
      `INSERT INTO clearsky.auth_account (user_id,provider,provider_uid,password_hash)
       VALUES ($1,'LOCAL',$2,$3)`,
      [uRes.rows[0].id, email, hash]
    );
    res.sendStatus(201);
  } catch (err) { next(err); }
};
