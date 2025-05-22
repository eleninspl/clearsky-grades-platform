// middleware/authorize.js
// ─────────────────────────────────────────────────────────
// Χρήση:  authorize( [allowRoles], [allowInstitutions] )
//
//   allowRoles         : π.χ. ['ADMIN','INST_REP']   (προαιρετικό)
//   allowInstitutions  : π.χ. [1, 3]                (προαιρετικό)
//                       id-αριθμοί από τον πίνακα institution
//
// Αν δεν περάσεις δεύτερο argument, ελέγχεται μόνο ο ρόλος.

const jwt = require('jsonwebtoken');

module.exports = (roles = [], instIds = null) => (req, res, next) => {
  const hdr = req.headers.authorization;
  if (!hdr?.startsWith('Bearer ')) return res.sendStatus(401);

  try {
    const payload = jwt.verify(hdr.slice(7), process.env.JWT_SECRET);
    // 1. Ρόλος
    if (roles.length && !roles.includes(payload.role))
      return res.sendStatus(403);

    // 2. Institution filter
    if (instIds && !instIds.includes(payload.inst))
      return res.sendStatus(403);

    req.user = payload;            // { sub, role, inst }
    next();
  } catch {
    res.sendStatus(401);
  }
};
