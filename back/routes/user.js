const express = require('express');
const router = express.Router(); // on crée un router via express (méthode .Router)

const User = require('../models/user');

router.post('/auth/signup', (req, res, next) => {
    const user = new User({ // on crée une nouvelle instance de notre modèle "user" auquel on passe un objet contenant toutes les infos
      ...req.body
    });
    console.log(user);
    console.log(req.body);
    user.save() // permet d'enregistrer l'objet dans la BDD, puis retourne un promise
    //.then(()=> res.status(201).json({ message: "Utilisateur enregistré !" })) // il faut renvoyer une réponse au front, sinon expiration de la requête. Code 201 : bonne création de la ressource
    .catch (error => res.status(400).json({ error })); 
    next()
  });

//pour trouver un user précis dans la BDD par son identifiant, pour utiliser route
router.get('/signup/:id', (req, res, next) => { // :id est dynamique, on rend 'id'  accessible (avec le ":") en tant que paramètre.
  user.findOne({ _id: req.params.id }) // on utilise la méthode findOne dans le modèle user pour trouver l'user unique ayant le même _id que le paramètre de la requête
  .then(user => res.status(200).json(user)) // user est retourné dans une promise et envoyé au front end
  .catch(error => res.status(404).json({ error }));
  next()
}); 


//pour lire les users.
router.get('/signup/', (req, res, next) => { // chaine de caract /api/auth/signup = l'url visée par l'appli, la route visée sur l'API.
    user.find() //méthode pour trouver liste complète, va nous retourner une promise
    .then(users => res.status(200).json(things)) // on récup le tableau de tous les users renvoyé par la bdd
    .catch(error => res.status(400).json({error})) 
    next();
  });

router.get('/test/', (req, res, next) => { // chaine de caract /api/auth/signup = l'url visée par l'appli, la route visée sur l'API.
    res.status(200).json( {message: "ok"} ); // on récup le tableau de tous les users renvoyé par la bdd
    next();
  });

module.exports = router;