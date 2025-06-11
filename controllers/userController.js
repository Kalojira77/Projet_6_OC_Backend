const User = require('../models/User');

exports.createUser = async (req, res) => {
  console.log('Route POST /api/users atteinte !');
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email et mot de passe requis.' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Cet email existe déjà.' });
    }

    const userToSave = new User({
      email,
      password, 
    });

    const savedUser = await userToSave.save();

    return res.status(201).json({
      message: 'Utilisateur créé !',
      user: { _id: savedUser._id, email: savedUser.email }
    });
  } catch (err) {
    console.error('Erreur création User :', err);
    if (err.code === 11000 && err.keyPattern?.email) {
      return res.status(400).json({ message: 'Cet email existe déjà.' });
    }
    return res.status(500).json({ error: 'Erreur serveur.' });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const allUsers = await User.find().select('_id email');
    return res.status(200).json(allUsers);
  } catch (err) {
    console.error('Erreur lecture Users :', err);
    return res.status(500).json({ error: 'Erreur serveur.' });
  }
};

