require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();

require('./utils/db');

app.use(express.json());

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

app.use('/api/users', require('./routes/user'));
app.use('/api/books', require('./routes/book'));

// app.use('/api/auth', require('./routes/auth'));

module.exports = app;
