const express = require('express'); // pour importer Express
const mongoose = require('mongoose');
const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');
const helmet = require('helmet');

const app = express(); //sera notre application Express, appelle la méthode express

app.use(helmet({crossOriginResourcePolicy:{policy:'same-site'}}));

app.use((req, res, next) => { // On va ajouter des headers sur l'objet réponse, pour éviter les ERREURS CORS
  res.setHeader('Access-Control-Allow-Origin', '*'); // toutes les origines ont le droit d'accéder à notre API
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'); //autorisation d'utiliser certains headers sur l'objet requete
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');//autorisation d'utiliser certaines méthodes GET POST PUT etc
  next();
});

app.use(express.json());

mongoose.connect('mongodb+srv://Test:test@cluster0.6dscriu.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);

module.exports = app; //exporte la constante (l'application) pour pouvoir y accéder depuis les autres fichiers du projet