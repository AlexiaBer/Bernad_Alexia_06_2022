const Sauce = require('../models/Sauce');

const app = require('../app');
const auth = require('../middleware/auth');

exports.saucesList = (req, res, next) => {
  Sauce.find() // find nous retourne la liste complète dans une promise
  .then(sauces => res.status(200).json(sauces)) // user est retourné dans une promise et envoyé au front end
  .catch(error => res.status(400).json({ error }));
};
  
exports.findOneSauce = (req, res, next) => { // :id est dynamique, on rend 'id'  accessible (avec le ":") en tant que paramètre.
  Sauce.findOne({ _id: req.params.id })
  .then(sauce => res.status(200).json(sauce))
  .catch(error => res.status(404).json({ error }));
};
  
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.thing);
    delete sauceObject._id;
    delete sauceObject._userId;
    const sauce = new Sauce({
      ...sauceObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });    
    sauce.save()
    .then(() => res.status(201).json({ message: "Sauce créée !" }))
    .catch (error => res.status(400).json({ error })); 
};
 

exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ? {
    ...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}`
  } : { ...req.body };

  delete sauceObject._userId;
  Sauce.findOne({_id: req.params.id})
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) {
        res.status(401).json({ message : 'Non autorisé' });
      } else {
        Sauce.updateOne({ _id: req.params.id}, {...sauceObject, _id: req.params.id})
        .then(() => res.status(200).json({ message : "Sauce modifiée" }))
        .catch(error => res.status(401).json({ error }));
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    })
}

/*
exports.deleteSauce = (req, res, next) => {
}

exports.likeSauce = (req, res, next) => {
}
*/
