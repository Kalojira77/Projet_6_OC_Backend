/* Chargement des variables d'environnement */
require('dotenv').config();

/* Dépendances principales */
const express = require('express');
const path = require('path');

/* Middleware d'authentification */
const auth = require('./middleware/auth');

/* Initialisation d'Express */
const app = express();

/* Connexion à la base de données */
require('./utils/db');

app.use(express.json());

// CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS'
  );
  next();
});

app.use('/images', express.static(path.join(__dirname, 'images')));


app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/user'));
app.use('/api/books', require('./routes/book'));

module.exports = app;
