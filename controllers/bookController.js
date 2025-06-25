// controller/bookController.js

const Book = require('../models/Book');
const deleteImageFromUrl = require('../utils/deleteImage');

// =========================
// 🔸 Créer un nouveau livre
// =========================
exports.createBook = async (req, res) => {
  try {
    console.log('>>> [DEBUG] Requête reçue dans createBook');
    console.log('req.body:', req.body);
    console.log('req.file:', req.file);

    if (!req.file || !req.file.filename) {
      return res.status(400).json({
        message: "Image manquante ou invalide.",
      });
    }

    const parsedBook = JSON.parse(req.body.book);
    const { title, author, year, genre, ratings } = parsedBook;

    if (!title || !author || !year || !genre || !ratings) {
      return res.status(400).json({
        message: 'Tous les champs (titre, auteur, image, année, genre, note) sont requis.',
      });
    }

    const numericRating = Number(parsedBook.averageRating);
    if (isNaN(numericRating) || numericRating < 0 || numericRating > 5) {
      return res.status(400).json({ message: 'Note invalide. Elle doit être entre 0 et 5.' });
    }

    const newBook = new Book({
      ...parsedBook,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`,
    });

    const savedBook = await newBook.save();
    return res.status(201).json({
      message: 'Livre créé !',
      book: savedBook,
    });

  } catch (err) {
    console.error('Erreur dans createBook:', err.message);
    return res.status(400).json({ error: err.message });
  }
};

// ======================
// 🔹 Récupérer tous les livres
// ======================
exports.getAllBooks = async (req, res) => {
  try {
    const allBooks = await Book.find().sort({ averageRating: -1 });
    return res.status(200).json(allBooks);
  } catch (err) {
    console.error('Erreur lecture Books :', err);
    return res.status(400).json({ error: err.message });
  }
};

// ======================
// 🔹 Récupérer un livre par ID
// ======================
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

// ======================
// 🔹 Modifier un livre // mieux si book supp avant image ?//
// ======================
exports.modifyBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Livre non trouvé" });
    }

    if (book.userId.toString() !== req.auth.userId) {
      return res.status(403).json({ message: "Requête non autorisée." });
    }

    let updatedData;
    console.log('[DEBUG modifyBook] req.file:', req.file);

    if (req.file && req.file.filename) {
      deleteImageFromUrl(book.imageUrl); 

      const parsedBook = JSON.parse(req.body.book);
      updatedData = {
        ...parsedBook,
        imageUrl: `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`,
      };
    } else {
      updatedData = { ...req.body };
    }

    await Book.updateOne({ _id: req.params.id }, { ...updatedData, _id: req.params.id });

    return res.status(200).json({ message: "Livre modifié !" });

  } catch (error) {
    console.error('Erreur modification livre :', error);
    return res.status(400).json({ error: error.message });
  }
};

// ======================
// 🔹 Supprimer un livre
// ======================
exports.deleteBook = async (req, res) => {
  try {
    const bookId = req.params.id;

    const bookToDelete = await Book.findById(bookId);
    if (!bookToDelete) {
      return res.status(404).json({ message: 'Livre non trouvé' });
    }

    if (bookToDelete.userId.toString() !== req.auth.userId) {
      return res.status(403).json({ message: 'Requête non autorisée.' });
    }

    deleteImageFromUrl(bookToDelete.imageUrl);

    await Book.findByIdAndDelete(bookId);

    return res.status(204).json({ message: 'Livre supprimé !' }); 
  } catch (err) {
    console.log('Erreur suppression Book :', err);
    return res.status(400).json({ error: err.message });
  }
};

// ======================
// 🔹 Noter un livre
// ======================
exports.rateBook = async (req, res) => {
  try {
    const bookId = req.params.id;
    const { rating } = req.body;

    if (rating < 0 || rating > 5) {
      return res.status(400).json({ message: 'Note invalide. Elle doit être entre 0 et 5.' });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Livre non trouvé' });
    }

    const filteredRatings = book.ratings.filter(
      (r) => r.userId.toString() === req.auth.userId
    );

    if (filteredRatings.length > 0) {
      return res.status(400).json({ message: 'Vous avez déjà noté ce livre.' });
    }

    book.ratings.push({ userId: req.auth.userId, grade: rating });

    const sum = book.ratings.reduce((acc, r) => acc + r.grade, 0);
    book.averageRating = Math.round((sum / book.ratings.length) * 10) / 10;

    await book.save();

    return res.status(201).json(book);
  } catch (err) {
    console.error('Erreur notation Book :', err);
    return res.status(400).json({ error: err.message });
  }
};

// ======================
// 🔹 Top 3 livres
// ======================
exports.getTopThree = async (req, res) => {
  try {
    const top = await Book.find().sort({ averageRating: -1 }).limit(3);
    return res.status(200).json(top);
  } catch (err) {
    console.error('Erreur top 3 :', err);
    return res.status(400).json({ error: err.message });
  }
};
