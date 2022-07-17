const Sauce = require('../models/Sauce');
const fs = require('fs');

const app = require('../app');
const auth = require('../middleware/auth');

exports.saucesList = (req, res, next) => { // pour afficher la liste des sauces dans le menu "All Sauces"
  Sauce.find() 
  .then(sauces => {
    res.status(200).json(sauces)
  })
  .catch(error => res.status(400).json({ error }));
};
  
exports.findOneSauce = (req, res, next) => { // pour afficher UNE sauce grace à son id
  Sauce.findOne({ _id: req.params.id }) //:id est dynamique, on rend 'id'  accessible (avec le ":") en tant que paramètre.
  .then(sauce => res.status(200).json(sauce))
  .catch(error => res.status(404).json({ error }));
};
  
exports.createSauce = (req, res, next) => { // pour créer une sauce dans le menu "Add Sauce"
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id; // l'id de la sauce sera généré automatiquement par la BDD
    delete sauceObject._userId; // on ne fait pas confiance au client, on utilise plutôt le userId qui vient du token d'authentification
    const sauce = new Sauce({
      ...sauceObject,
      userId: req.auth.userId,
      imageUrl : `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });    
    sauce.save()
    .then(() => res.status(201).json({ message: "Sauce créée", sauce: sauce}))
    .catch (error => res.status(400).json({ error })); 
};

exports.modifySauce = (req, res, next) => { // pour modifier une sauce sur la page-même de la sauce (créateur de la sauce seulement)
  const sauceObject = req.file ? { // selon que l'user aura transmis ou non un fichier, format de requete n'est pas le même = s'il y a un fichier, on obtient l'objet sous la forme d'une chaine de caract. C'est l'inverse quand il n'y a pas de fichier. on check s'il y a un champ de type file pour savoir comment on récupèrera notre objet
    ...JSON.parse(req.body.sauce), //si c'est le cas, on récup l'objet en parsant la chaine de caract
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body }; // si il n'y a pas de fichier transmis, on récupère simplement l'objet dans le corps de la requete
  delete sauceObject._userId; // on supprime le userId venant de la requête (mesure de sécurité)
  Sauce.findOne({_id: req.params.id}) // on cherche l'objet dans la BDD car on doit vérif l'utilisateur qui l'a créé. Lui seul peut modifier
    .then((sauce) => {
      if (sauce.userId != req.auth.userId) { //les deux userId sont différents, donc ça ne marchera pas. Le 1er : celui qu'on a récup en BDD, le 2ème : celui qui vient du token
        res.status(401).json({ message : 'Non autorisé' });
      } else {
        Sauce.updateOne({ _id: req.params.id}, {...sauceObject, _id: req.params.id}) // MAJ de la sauce. 1ères accolades : le filtre pour savoir quel enregistrement est à mettre à jour, puis on passe 2 paramètres dans la 2ème accolade : quel objet est à mettre à jour : 1) le corps de la fonction 2) l'id des paramètres de l'url
        .then(() => res.status(200).json({ message : "Sauce modifiée" }))
        .catch(error => res.status(401).json({ error }));
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    })
}

exports.deleteSauce = (req, res, next) => { // pour supprimer une sauce sur la page-même de la sauce (créateur de la sauce seulement)
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

exports.likeSauce = (req, res, next) => { //pour ajouter un like, un dislike ou annuler son like/dislike
  const likedSauce = Sauce.findOne({ _id: req.params.id }) // pour situer la bonne sauce à liker
  .then(sauce => {
    if(req.body.like == 1) { // si l'user clique sur like
      if(sauce.usersLiked != req.body.userId) { // si l'user n'a pas déjà liké la sauce
      sauce.likes++; // on ajoute 1 like 
      sauce.usersLiked.push(req.body.userId); // on ajoute l'id de l'user dans le tableau des usersLiked
      sauce.save(); // on enregistre
      console.log("usersLiked : " + sauce.usersLiked)
      console.log("sauce.likes : " + sauce.likes)
      res.status(200).json({ message: "Sauce likée !"})
      }
    }
    if(req.body.like == 0) { // si l'user ANNULE son like ou son dislike
     if(sauce.usersLiked.includes(req.body.userId)) {//l'user souhaite annuler son like
      sauce.likes--;
      sauce.usersLiked.splice(req.body.userId);
      sauce.save();
      console.log("usersLiked : " + sauce.usersLiked)
      res.status(200).json({ message: "L'utilisateur annule son like" })
      }
      if(sauce.usersDisliked.includes(req.body.userId)) { // l'user souhaite annuler son dislike
        sauce.dislikes--;
        sauce.usersDisliked.splice(req.body.userId);
        sauce.save();
        console.log("usersDisliked : " + sauce.usersDisliked)
        res.status(200).json({ message: "L'utilisateur annule son dislike" })
      }
    }
    if(req.body.like == -1) { // si l'user clique sur dislike
      if(sauce.usersDisliked != req.body.userId) { // si l'user n'a pas déjà disliked la sauce
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
