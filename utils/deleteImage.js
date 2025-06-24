// utils/deleteImage.js

const fs = require('fs');
const path = require('path');

/**
 * Supprime une image du dossier /uploads à partir de son URL complète
 * @param {string} imageUrl 
 */
const deleteImageFromUrl = (imageUrl) => {
  if (!imageUrl) return;

  const filename = imageUrl.split('/uploads/')[1]; 
  if (!filename) return;

  const filepath = path.join(__dirname, '..', 'uploads', filename);
  
  fs.unlink(filepath, (err) => {
    if (err) {
      console.error('Erreur lors de la suppression de l’image :', err.message);
    } else {
      console.log('Image supprimée :', filename);
    }
  });
};

module.exports = deleteImageFromUrl;
