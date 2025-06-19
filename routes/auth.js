// routes/auth.js

const express = require('express');
const router  = express.Router();
const authController = require('../controllers/authController');

const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // max 5 tentatives par IP
  message: 'Trop de tentatives de connexion. Réessayez dans 15 minutes.',
  standardHeaders: true, 
  legacyHeaders: false, 
});


router.post('/signup', authController.signup);
router.post('/login', loginLimiter, authController.login);

module.exports = router;
