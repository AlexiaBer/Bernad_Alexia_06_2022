//ce fichier est un middleware pour configurer multer pour lui expliquer comment gérer les fichiers, les enregistrer...

const multer = require('multer'); 

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

const storage = multer.diskStorage({ //on l'enregistre sur le disque. Need 2 éléments : destination et filename
    destination: (req, file, callback) => { // destination pour savoir dans quel dosser enregistrer les fichiers
        callback(null, 'images')
    },
    filename: (req, file, callback) => { // filename explique à multer quel nom de fichier générer (pas celui d'origine)
        const name = file.originalname.split(' ').join('_'); // split pour enlever les espaces du nom d'origine du fichier et les remplacer par des _
        const extension = MIME_TYPES[file.mimetype]; // on applique une extension au fichier. On utilise les mime types pour générer l'extension du fichier
        callback(null, name + Date.now() + '.' + extension);
    }
});

module.exports = multer({ storage }).single('image'); // On exporte le middleware multer. single = fichier unique type image