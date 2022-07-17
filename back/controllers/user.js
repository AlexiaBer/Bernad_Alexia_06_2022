const bcrypt = require('bcrypt');
const cryptoJs = require('crypto-js');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const app = require('../app');

const bodyParser = require('body-parser');

exports.createUser = (req, res, next) => {
    const cryptedEmail = cryptoJs.HmacSHA256(req.body.email, "?cle1de2securite3!").toString();
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: cryptedEmail,
        password: hash
      });
      user.save() // permet d'enregistrer l'objet dans la BDD, puis retourne un promise
      .then(() => res.status(201).json({ message : "Utilisateur créé !" }))
      .catch(error => res.status(400).json({ error }))
    })
    .catch(error => res.status(500).json({ error }));
}

exports.userConnexion = (req, res, next) => { // vérifier si l'user existe dans BDD et si le mdp donné correspond à cet user
  const cryptedEmail = cryptoJs.HmacSHA256(req.body.email, "?cle1de2securite3!").toString();
  User.findOne({ email: cryptedEmail })
  .then(user => {
    if (user === null) { // l'user n'existe pas dans la BDD
      res.status(401).json({ message : "Paire identifiant/mot de passe incorrecte" });
    } else if (user) {
      console.log(cryptedEmail)
      bcrypt.compare(req.body.password, user.password) //on compare les 2 mdp : req.body.password : celui qui est écrit par le client, user.password : celui de la bdd
      .then(valid => {
        if (!valid) { // le mdp transmis n'est pas correct
          res.status(401).json({message: "Paire identifiant/mot de passe incorrecte"})
          } else { // le mdp est correct, la fonction retourne l'userId et le token
            res.status(200).json({
              userId: user._id,
              token: jwt.sign( // fonction sign de jsonwebtoken : pour chiffrer un nouveau token
                { userId: user._id }, // les données qu'on veut encoder à l'intérieur de ce token, le payload. Pour être sûr que cette requete corresp bien à ce userId
                'test782voilacommecaonverra903', //la clé secrète pour l'encodage (utiliser en temps normal une chaine de caract bcp plus longue et très aléatoire)
                { expiresIn: '24h' } //on applique une expiration pour le token. Après 24h il n'est plus valable, l'user devra se reconnecter au bout de 24h
              )
            });
          }
        })
      .catch(error => {
        res.status(500).json({ message: "erreur 500 dans le else " });
      })
    }
  })
  .catch(error => { res.status(500).json({ error })})
}