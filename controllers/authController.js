// controllers/authController.js

require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt    = require('jsonwebtoken');
const User   = require('../models/User');

exports.signup = async (req, res) => {
  try {
    const { email, password } = req.body;
    const validator = require('validator');

    if (!email || !validator.isEmail(email)) {
      return res.status(400).json({ message: 'Email invalide.' });
    }
    if (!password || password.length < 8) {
      return res.status(400).json({ message: 'Mot de passe trop court (min 8 caractères).' }); 
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({
      email,
      password: hashedPassword
    });
    await user.save();

    res.status(201).json({ message: 'Utilisateur créé !', userId: user._id });
  } catch (err) {

    if (err.code === 11000) {
            return res.status(400).json({
                error: "Cet email est déjà utilisé",
            });
        }
        return res.status(400).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
  if (!email || !password) {
  return res.status(400).json({ error: 'Email et mot de passe requis.' });
}

    const user = await User.findOne({ email });
   if (!user) {
  return res.status(401).json({ error: 'Email ou mot de passe incorrect.' });
}

    const valid = await bcrypt.compare(password, user.password);
 if (!valid) {
  return res.status(401).json({ error: 'Email ou mot de passe incorrect.' });
}
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({ userId: user._id, token });
  } catch (err) {
    console.error('Erreur login :', err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
};
