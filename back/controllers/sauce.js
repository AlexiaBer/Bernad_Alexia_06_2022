const Sauce = require('../models/Sauce');

exports.saucesList = (req, res, next) => {
  Sauce.find() // on utilise la méthode findOne dans le modèle user pour trouver l'user unique ayant le même _id que le paramètre de la requête
  .then(sauces => res.status(200).json(sauces)) // user est retourné dans une promise et envoyé au front end
  .catch(error => res.status(400).json({ error }));
  next();
};
  
exports.findOneSauce = (req, res, next) => { // :id est dynamique, on rend 'id'  accessible (avec le ":") en tant que paramètre.
  Sauce.findOne({ _id: req.params.id })
  .then(sauce => res.status(200).json(sauce))
  .catch(error => res.status(404).json({ error }));
  next();
};
  
exports.createSauce = (req, res, next) => {
  //  delete req.body._id;
    const sauce = new Sauce ({
      ...req.body
    })    
    sauce.save()
    .then(() => res.status(201).json({ message: "Sauce crée !" }))
    .catch (error => res.status(400).json({ error })); 
    next()
};
  
exports.modifySauce = (req, res, next) => {
      sauce._id
    
}

exports.deleteSauce = (req, res, next) => {
      
}

exports.likeSauce = (req, res, next) => {

}