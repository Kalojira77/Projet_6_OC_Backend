// middleware/auth.js

require('dotenv').config();
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header) {
      return res.status(401).json({ message: 'Token manquant !' });
    }
    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.auth = { userId: decoded.userId };
    next();
  } catch (err) {
    console.error('Auth error :', err);
    res.status(401).json({ message: 'Requête non authentifiée !' });
  }
};
