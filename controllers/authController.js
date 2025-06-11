require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt    = require('jsonwebtoken');
const User   = require('../models/User');

exports.signup = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email et mot de passe requis.' });
    }

    // Vérifier l’existence
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Cet email existe déjà.' });
    }

    // Hachage du mot de passe
    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({
      email,
      password: hashedPassword
    });
    await user.save();

    res.status(201).json({ message: 'Utilisateur créé !', userId: user._id });
  } catch (err) {
    console.error('Erreur signup :', err);
    res.status(500).json({ error: 'Erreur serveur.' });
  }
};

exports.login = async (req, res) => {
  console.log('[LOGIN] req.body =', req.body);
  try {
    const { email, password } = req.body;
  if (!email || !password) {
  return res.status(400).json({ error: 'Email et mot de passe requis.' });
}

    const user = await User.findOne({ email });
   if (!user) {
  return res.status(401).json({ error: 'Utilisateur non trouvé.' });
}

    const valid = await bcrypt.compare(password, user.password);
 if (!valid) {
  return res.status(401).json({ error: 'Mot de passe incorrect.' });
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
