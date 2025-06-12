// middleware/multer-config.js
const multer = require('multer');

const storage = multer.memoryStorage(); // fichier en mémoire
module.exports = multer({ storage }).single('image'); // 'image' = nom du champ du formulaire
