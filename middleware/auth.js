// middleware/auth.js

require('dotenv').config();
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header) {
      return res.status(401).json({ message: 'Token manquant !' });
    }
    const [type, token] = header.split(' ');
    if (type !== 'Bearer' || !token) {
    return res.status(401).json({ message: 'Format d\'autorisation invalide' });
  }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.auth = { userId: decoded.userId };
    next();
  } catch (err) {
    console.error('Auth error :', err);
    res.status(401).json({ message: 'Requête non authentifiée !' });
  }
};
