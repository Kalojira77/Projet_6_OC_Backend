// middleware/multer-config.js

const multer = require('multer');

const storage = multer.memoryStorage(); 
module.exports = multer({ storage }).single('image'); 
