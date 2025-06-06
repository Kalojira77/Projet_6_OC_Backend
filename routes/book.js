const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');

router.post('/', bookController.createBook);
router.get('/', bookController.getAllBooks);
router.get('/:id', bookController.getBookById);
router.put('/:id', bookController.modifyBook);
router.delete('/:id', bookController.deleteBook);
router.post('/:id/rating', bookController.rateBook);

module.exports = router;
