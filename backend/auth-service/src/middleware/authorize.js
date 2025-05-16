// Ελέγχει JWT, βάζει req.user
const jwt = require('jsonwebtoken');

module.exports = (roles = []) => (req, res, next) => {
  const hdr = req.headers['authorization'];
  if (!hdr?.startsWith('Bearer ')) return res.sendStatus(401);
  try {
    const payload = jwt.verify(hdr.slice(7), process.env.JWT_SECRET);
    if (roles.length && !roles.includes(payload.role)) return res.sendStatus(403);
    req.user = payload;               // { sub, role, inst }
    next();
  } catch {
    res.sendStatus(401);
  }
};
