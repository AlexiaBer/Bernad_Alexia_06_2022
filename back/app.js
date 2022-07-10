const express = require('express'); // pour importer Express
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const path = require('path');//accéder au path (chemin) de notre serveur

const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');

mongoose.connect('mongodb+srv://Test:test@cluster0.6dscriu.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express(); //sera notre application Express, appelle la méthode express
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(bodyParser.json());
//app.use(express.json());
app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app; //exporte la constante (l'application) pour pouvoir y accéder depuis les autres fichiers du projet