// credits-service/src/middleware/authorize.js
const axios = require('axios');

module.exports = function authorize(allowedRoles = []) {
  return async function (req, res, next) {
    const token = req.headers.authorization;
    if (!token) return res.status(401).json({ error: 'Missing token' });

    try {
      const response = await axios.post('http://auth-service:5001/verify', {}, {
        headers: { Authorization: token },
      });

      const user = response.data.user;

      if (allowedRoles.length && !allowedRoles.includes(user.role)) {
        return res.status(403).json({ error: 'Forbidden' });
      }

      req.user = user;
      next();
    } catch {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  };
};
