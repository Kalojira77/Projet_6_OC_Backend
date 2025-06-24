// app.js

// moongose sanityse -> check les requêtes contre les injections de code "_"

require('dotenv').config();

const express = require('express');
const path = require('path');

const auth = require('./middleware/auth');

const app = express();
app.use((req, res, next) => {
  console.log(`Requête Express : ${req.method} ${req.url}`);
  next();
});

require('./utils/db');

app.use(express.json());

const helmet = require('helmet');

// 🛡️ Protection des headers HTTP
app.use(helmet({
  crossOriginResourcePolicy: false
}));


const rateLimit = require('express-rate-limit');

const globalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // 100 requêtes max par IP
  message: 'Trop de requêtes. Réessayez plus tard.',
  standardHeaders: true,
  legacyHeaders: false
});

app.use(globalLimiter);

app.use((req, res, next) => {
  if (req.rateLimit) {
    console.log('🌐 Global rateLimit info :', req.rateLimit);
  }
  next();
});

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

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use('/api/auth', require('./routes/auth'));
app.use('/api/books', require('./routes/book'));

module.exports = app;
