const multer = require('multer');

// Dictionnaire des types MIME autorisés
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp'
};

// Utilise la mémoire, pas le disque
const storage = multer.memoryStorage();

// Middleware multer sécurisé
module.exports = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // max 2 Mo
  fileFilter: (req, file, cb) => {
    if (MIME_TYPES[file.mimetype]) {
      cb(null, true); // Type autorisé
    } else {
      cb(new Error('Type de fichier non autorisé'), false); // Bloqué
    }
  }
}).single('image'); // le champ s'appelle "image"
