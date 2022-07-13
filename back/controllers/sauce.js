const Sauce = require('../models/Sauce');
const fs = require('fs');

const app = require('../app');
const auth = require('../middleware/auth');

exports.saucesList = (req, res, next) => {
  console.log("recup sauces")
  Sauce.find() // find nous retourne la liste complète dans une promise
  .then(sauces => res.status(200).json([sauces])) // les sauces sont retournées dans une promise et envoyé au front end
  .catch(error => res.status(400).json({ error }));
};
  
exports.findOneSauce = (req, res, next) => { // :id est dynamique, on rend 'id'  accessible (avec le ":") en tant que paramètre.
  Sauce.findOne({ _id: req.params.id })
  .then(sauce => res.status(200).json(sauce))
  .catch(error => res.status(404).json({ error }));
};
  
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id; // l'id de la sauce sera généré automatiquement par la BDD
    delete sauceObject._userId; // on ne fait pas confiance au client, on utilise plutôt le userId qui vient du token d'authentification
    const sauce = new Sauce({
      ...sauceObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });    
    sauce.save()
    .then(() => res.status(201).json({ message: "Sauce créée" }))
    .catch (error => res.status(400).json({ error })); 
};

exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ? { // on check s'il y a un champ de type file
    ...JSON.parse(req.body.sauce), //si c'est le cas, on récup l'objet en parsant la chaine de caract
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };
  delete sauceObject._userId; // on supprime le userId venant de la requête
  Sauce.findOne({_id: req.params.id}) // on cherche l'objet dans la BDD car on doit vérif l'utilisateur qui l'a créé. Lui seul peut modifier
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) { //les deux userId sont différents, donc ça ne marchera pas
        res.status(401).json({ message : 'Non autorisé' });
      } else {
        Sauce.updateOne({ _id: req.params.id}, {...sauceObject, _id: req.params.id}) // MAJ de la sauce. 1ères accolades : le filtre pour savoir quel enregistrement et à mettre à jour, puis on passe 2 paramètres dans la 2ème accolade : quel objet est à mettre à jour : 1) le corps de la fonction 2) l'id des paramètres de l'url
        .then(() => res.status(200).json({ message : "Sauce modifiée" }))
        .catch(error => res.status(401).json({ error }));
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    })
}

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({_id: req.params.id})
    .then(sauce => {
      if (thing.userId != req.auth.userId) {
        res.status(401).json({ message: 'Non autorisé' });
      } else {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({_id: req.params.id})
          .then(() => { res.status(200).json({ message : 'Objet supprimé' }) })
          .catch(error => res.status(401).json({ error}));
        }
        )}
    })
    .catch( error => {
      res.status(500).json({ error });
    });
}
/*
exports.likeSauce = (req, res, next) => {
}
*/
