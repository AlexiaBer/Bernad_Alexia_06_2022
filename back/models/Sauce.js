const mongoose = require('mongoose');

const sauceSchema = mongoose.Schema({
    sauce: { type: String },
    //image: { type : File }
});

module.exports = mongoose.model('Sauce', sauceSchema); // pour l'exploiter comme modèle, on l'exporte.