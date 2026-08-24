const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRET_KEY = process.env.JWT_SECRET;

const optionalAuth = (req, res, next) => {
  const token = req.headers['x-access-token'];
  if (!token) {
    req.user = null;
    return next();
  }
  try {
    req.user = jwt.verify(token, SECRET_KEY);
  } catch {
    req.user = null;
  }
  next();
};

module.exports = optionalAuth;
