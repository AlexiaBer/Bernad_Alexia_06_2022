const mongoose = require('mongoose');

const sauceSchema = mongoose.Schema({
    sauce: {type: String, required: true},
   // image: {type : File, required: true}
});

module.exports = mongoose.model('Sauce', sauceSchema); // pour l'exploiter comme modèle, on l'exporte.