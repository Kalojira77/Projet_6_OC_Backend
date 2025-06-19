// middleware/imageProcessor.js
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

module.exports = async (req, res, next) => {
  if (!req.file) return next(); // Pas de fichier → continuer

  try {
    // Générer un nom unique, propre et lisible
    const getDateString = () => {
      const d = new Date();
      return d.toISOString().slice(0, 10).replace(/-/g, ''); // ex : 20250619
    };

    const uniqueId = crypto.randomBytes(4).toString('hex'); // ex : 7f3a9c1e
    const filename = `cover_${getDateString()}_${uniqueId}.webp`;

    // Chemin de destination dans le dossier uploads
    const outputPath = path.join(__dirname, '..', 'uploads', filename);

    // Traitement de l'image avec Sharp
    await sharp(req.file.buffer)
      .resize(600) // largeur fixe
      .webp({ quality: 80 }) // conversion en WebP
      .toFile(outputPath);

    // Injecter le nom du fichier pour le contrôleur
    req.file.filename = filename;

    next();
  } catch (err) {
    console.error('❌ Erreur imageProcessor:', err);
    res.status(500).json({ error: "Erreur lors du traitement de l'image." });
  }
};
