const Book = require('../models/Book');

// =========================
// 🔸 Créer un nouveau livre
// =========================

exports.createBook = async (req, res) => {
  try {

      console.log('>>> [DEBUG] Requête reçue dans createBook');
  console.log('req.body:', req.body);
  console.log('req.file:', req.file);

    const parsedBook = JSON.parse(req.body.book);

    const { title, author, year, genre, ratings } = parsedBook;

    if (!title || !author || !year || !genre || !ratings ){
      return res.status(400).json({
        message: 'Tous les champs (titre, auteur, image, année, genre, note) sont requis.'
      });
    }

    const numericRating = Number(parsedBook.averageRating);
    if (isNaN(numericRating) || numericRating < 0 || numericRating > 5) {
      return res.status(400).json({ message: 'Note invalide. Elle doit être entre 0 et 5.' });
    }
    console.log(req.file.filename);
    const newBook = new Book({
      ...parsedBook,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get("host")}/uploads/${
                      req.file.filename
                  }`,
    });

    const savedBook = await newBook.save();
    if (!savedBook) {
      return res.status(500).json({ message: 'Erreur lors de la création du livre.' });
    }
    return res.status(201).json({
      message: 'Livre créé !',
      book: savedBook
    });

  } catch (err) {
    console.error(' Erreur dans createBook:', err.message);
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
// 🔹 Modifier un livre
// ======================
exports.modifyBook = async (req, res) => {
  try {
    const bookId = req.params.id;
    const updates = req.body;

    // Champs non modifiables
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

    await Book.findByIdAndDelete(bookId);
    return res.status(200).json({ message: 'Livre supprimé !' });

  } catch (err) {
    console.error('Erreur suppression Book :', err);
    return res.status(400).json({ error: err.message });
  }
};

// ======================
// 🔹 Noter un livre
// ======================
exports.rateBook = async (req, res) => {
  try {
    const bookId = req.params.id;
    const { userId, rating } = req.body;

    if (rating < 0 || rating > 5) {
      return res.status(400).json({ message: 'Note requise.' });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Livre non trouvé' });
    }

    const alreadyRated = book.ratings.some(
      (r) => r.userId.toString() === req.auth.userId
    );
    if (alreadyRated) {
      return res.status(400).json({ message: 'Vous avez déjà noté ce livre.' });
    }

    book.ratings.push({ 'userId': req.auth.userId, 'grade': rating });

    const sum = book.ratings.reduce((acc, r) => acc + r.grade, 0);
    console.log('Sum des notes:', sum);
    book.averageRating = Math.round((sum / book.ratings.length) * 10) / 10;

    await book.save();
    return res.status(201).json({
      message: 'Note ajoutée !',
      /* ajouter le livre concerné */
      averageRating: book.averageRating
    });

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
