// middleware/imageProcessor.js

const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

module.exports = async (req, res, next) => {
  if (!req.file) return next(); 
  try {
    const getDateString = () => {
      const d = new Date();
      return d.toISOString().slice(0, 10).replace(/-/g, ''); 
    };

    const uniqueId = crypto.randomBytes(4).toString('hex'); 
    const filename = `cover_${getDateString()}_${uniqueId}.webp`;

    const outputPath = path.join(__dirname, '..', 'uploads', filename);

    await sharp(req.file.buffer)
      .resize(340) 
      .webp({ quality: 80 }) 
      .toFile(outputPath);

    req.file.filename = filename;

    next();
  } catch (err) {
    console.error('❌ Erreur imageProcessor:', err);
    res.status(500).json({ error: "Erreur lors du traitement de l'image." });
  }
};
