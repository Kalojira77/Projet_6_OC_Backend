// middleware/imageProcessor.js
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

module.exports = async (req, res, next) => {
  if (!req.file) return next();

  try {
    const filename = `${Date.now()}_${req.file.originalname}.webp`;
    const outputPath = path.join(__dirname, '..', 'uploads', filename);

    await sharp(req.file.buffer)
      .resize(600) 
      .webp({ quality: 80 })
      .toFile(outputPath);

    req.file.filename = filename;
    next();
  } catch (err) {
    console.error('Erreur imageProcessor:', err);
    res.status(500).json({ error: "Erreur lors du traitement de l'image." });
  }
};
