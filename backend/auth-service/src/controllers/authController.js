const jwt = require('jsonwebtoken');

exports.handleGoogleCallback = (req, res) => {
  const token = jwt.sign({
    id: req.user.id,
    name: req.user.displayName,
    email: req.user.emails[0].value,
  }, process.env.JWT_SECRET);

  res.send(`✅ Login success!<br><br>Your token:<br><code>${token}</code>`);
};
