const Book = require('../models/Book');

exports.createBook = async (req, res) => {
  try {
    const { userId, title, author, imageUrl, year, genre } = req.body;

    const newBook = new Book({
      userId,
      title,
      author,
      imageUrl,
      year,
      genre,
      ratings: [],
      averageRating: 0
    });

    const savedBook = await newBook.save();
    return res.status(201).json({
      message: 'Livre créé !',
      book: savedBook
    });
  } catch (err) {
    console.error('Erreur création Book :', err);
    return res.status(400).json({ error: err.message });
  }
};

exports.getAllBooks = async (req, res) => {
  try {
    const allBooks = await Book.find().sort({ averageRating: -1 });
    return res.status(200).json(allBooks);
  } catch (err) {
    console.error('Erreur lecture Books :', err);
    return res.status(400).json({ error: err.message });
  }
};

exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Livre non trouvé' });
    }
    return res.status(200).json(book);
  } catch (err) {
    console.error('Erreur lecture Book par ID :', err);
    return res.status(400).json({ error: err.message });
  }
};

exports.modifyBook = async (req, res) => {
  try {
    const bookId = req.params.id;
    const updates = req.body;

    delete updates.userId;
    delete updates.ratings;
    delete updates.averageRating;

    const updatedBook = await Book.findByIdAndUpdate(
      bookId,
      updates,
      { new: true }
    );

    if (!updatedBook) {
      return res.status(404).json({ message: 'Livre non trouvé' });
    }

    return res.status(200).json({ message: 'Livre mis à jour !', book: updatedBook });
  } catch (err) {
    console.error('Erreur modification Book :', err);
    return res.status(400).json({ error: err.message });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const bookId = req.params.id;

    const bookToDelete = await Book.findById(bookId);
    if (!bookToDelete) {
      return res.status(404).json({ message: 'Livre non trouvé' });
    }

    // const fs = require('fs');
    // const path = require('path');
    // const filename = bookToDelete.imageUrl.split('/images/')[1];
    // fs.unlinkSync(path.join(__dirname, '../images', filename));

    await Book.findByIdAndDelete(bookId);
    return res.status(200).json({ message: 'Livre supprimé !' });
  } catch (err) {
    console.error('Erreur suppression Book :', err);
    return res.status(400).json({ error: err.message });
  }
};

exports.rateBook = async (req, res) => {
  try {
    const bookId = req.params.id;
    const { userId, grade } = req.body;

    if (grade == null) {
      return res.status(400).json({ message: 'Note (grade) requise.' });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Livre non trouvé' });
    }

    const alreadyRated = book.ratings.some(
      (r) => r.userId.toString() === userId
    );
    if (alreadyRated) {
      return res.status(400).json({ message: 'Vous avez déjà noté ce livre.' });
    }

    book.ratings.push({ userId, grade });

    const sum = book.ratings.reduce((acc, r) => acc + r.grade, 0);
    book.averageRating = Math.round((sum / book.ratings.length) * 10) / 10;

    await book.save();
    return res.status(201).json({
      message: 'Note ajoutée !',
      averageRating: book.averageRating
    });
  } catch (err) {
    console.error('Erreur notation Book :', err);
    return res.status(400).json({ error: err.message });
  }
};
