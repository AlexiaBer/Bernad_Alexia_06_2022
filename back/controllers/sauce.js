const Sauce = require('../models/Sauce');
const fs = require('fs');

const app = require('../app');
const auth = require('../middleware/auth');

// pour AFFICHER LA LISTE DES SAUCES dans le menu "All Sauces"

exports.saucesList = (req, res, next) => { 
  Sauce.find() 
  .then(sauces => {
    res.status(200).json(sauces)
  })
  .catch(error => res.status(400).json({ error }));
};
  
// pour AFFICHER UNE SAUCE grace à son id

exports.findOneSauce = (req, res, next) => { 
  Sauce.findOne({ _id: req.params.id }) 
  .then(sauce => res.status(200).json(sauce))
  .catch(error => res.status(404).json({ error }));
};
  
// pour CRÉER une sauce dans le menu "Add Sauce"

exports.createSauce = (req, res, next) => { 
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id; 
    delete sauceObject._userId; 
    const sauce = new Sauce({
      ...sauceObject,
      userId: req.auth.userId,
      imageUrl : `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });    
    sauce.save()
    .then(() => res.status(201).json({ message: "Sauce créée", sauce: sauce}))
    .catch (error => res.status(400).json({ error })); 
};

// pour MODIFIER une sauce sur la page-même de la sauce (créateur de la sauce seulement)

exports.modifySauce = (req, res, next) => { 
  const sauceObject = req.file ? { 
    ...JSON.parse(req.body.sauce), 
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
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

// pour SUPPRIMER une sauce sur la page-même de la sauce (créateur de la sauce seulement)

exports.deleteSauce = (req, res, next) => { 
  Sauce.findOne({_id: req.params.id})
    .then(sauce => {
      if (sauce.userId != req.auth.userId) {
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

//pour AJOUTER UN LIKE, un DISLIKE ou annuler son like/dislike

exports.likeSauce = (req, res, next) => { 
  const likedSauce = Sauce.findOne({ _id: req.params.id }) 
  .then(sauce => {
    if(req.body.like == 1) { // si l'user clique sur like
      if(sauce.usersLiked != req.body.userId) { 
      sauce.likes++; 
      sauce.usersLiked.push(req.body.userId); 
      sauce.save();
      res.status(200).json({ message: "Sauce likée !"})
      }
    }
    if(req.body.like == 0) { // si l'user annule son like ou son dislike
     if(sauce.usersLiked.includes(req.body.userId)) { //l'user souhaite annuler son like
      sauce.likes--;
      sauce.usersLiked.splice(req.body.userId);
      sauce.save();
      res.status(200).json({ message: "L'utilisateur annule son like" })
      }
      if(sauce.usersDisliked.includes(req.body.userId)) { // l'user souhaite annuler son dislike
        sauce.dislikes--;
        sauce.usersDisliked.splice(req.body.userId);
        sauce.save();
        res.status(200).json({ message: "L'utilisateur annule son dislike" })
      }
    }
    if(req.body.like == -1) { // si l'user clique sur dislike
      if(sauce.usersDisliked != req.body.userId) { 
      sauce.dislikes++;
      sauce.usersDisliked.push(req.body.userId);
      sauce.save();
      res.status(200).json({ message: "Sauce dislikée !"})
      } else { // si l'user a déjà disliké la sauce
        res.status(400).json({ message: "L'utilisateur n'aime déjà pas la sauce"})
      }
    }
  })
  .catch((error) => {
    res.status(500).json({ error });
  })
}
