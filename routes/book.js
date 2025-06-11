const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const bookController = require('../controllers/bookController');

// Routes publiques (lecture uniquement)
router.get('/', bookController.getAllBooks);
router.get('/bestrating', bookController.getTopThree);
router.get('/:id', bookController.getBookById);

// Routes protégées (nécessitent authentification)
router.post('/', auth, bookController.createBook);
router.put('/:id', auth, bookController.modifyBook);
router.delete('/:id', auth, bookController.deleteBook);
router.post('/:id/rating', auth, bookController.rateBook);

module.exports = router;
