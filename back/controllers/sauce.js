const Sauce = require('../models/Sauce');

const app = require('../app');

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
    delete req.body._id;
    const sauce = new Sauce({
      ...req.body
    });    
    sauce.save()
    .then(() => res.status(201).json({ message: "Sauce créée !" }))
    .catch (error => res.status(400).json({ error })); 
};
 
/*
exports.modifySauce = (req, res, next) => {
      sauce._id
}

exports.deleteSauce = (req, res, next) => {
}

exports.likeSauce = (req, res, next) => {
}
*/
