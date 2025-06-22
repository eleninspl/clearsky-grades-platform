const jwt = require('jsonwebtoken');
const db = require('../db');

module.exports = (roles = [], instIds = null) => async (req, res, next) => {
  const hdr = req.headers.authorization;
  if (!hdr?.startsWith('Bearer '))
    return res.status(401).json({ error: 'Missing or invalid token' });

  const token = hdr.slice(7); // αφαιρεί το "Bearer "

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // 👉 ΕΛΕΓΧΟΣ: Είναι blacklisted;
    const result = await db.query(
      `SELECT 1 FROM blacklisted_tokens WHERE token = $1`,
      [token]
    );
    if (result.rowCount > 0)
      return res.status(401).json({ error: 'Token has been revoked' });

    // 👉 Έλεγχος ρόλου
    if (roles.length && !roles.includes(payload.role))
      return res.sendStatus(403);

    // 👉 Έλεγχος institution
    if (instIds && !instIds.includes(payload.inst))
      return res.sendStatus(403);

    req.user = {
      id: payload.sub,
      full_name: payload.full_name,
      role: payload.role,
      institution_id: payload.inst
    };
    
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

