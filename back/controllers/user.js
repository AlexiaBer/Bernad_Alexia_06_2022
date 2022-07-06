const User = require('../models/User');

const app = require('../app');
const bodyParser = require('body-parser');

exports.createUser = (req, res, next) => {
  const user = new User({ // on crée une nouvelle instance de notre modèle "user" auquel on passe un objet contenant toutes les infos
    //...req.body
    email: "test@test.com",
    password: "truc"
  });
  console.log(user);
  user.save() // permet d'enregistrer l'objet dans la BDD, puis retourne un promise
  .then(()=> 
  { 
    console.log("user");
    res.status(201).json({ message: "Utilisateur enregistré !" }) }) 
  // il faut renvoyer une réponse au front, sinon expiration de la requête. Code 201 : bonne création de la ressource
  .catch(error => res.status(400).json({ error }));
 // next();
};

exports.userConnexion = (req, res, next) => {
  console.log(req.body.email)
  User.findOne({ email: req.body.email})
  .then(()=> res.status(200).json({ userId: "req.params._id, token: "}))
  .catch(error => {
    console.log("error")
    console.log(error)
    return res.json({ error })
  });



  next()
};