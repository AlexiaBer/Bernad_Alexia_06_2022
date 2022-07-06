//pour hasher le mdp

const bcrypt = require('bcrypt');

const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    email: {type: String},
    password: {type : String}
});

module.exports = mongoose.model('User', userSchema); // pour l'exploiter comme modèle, on l'exporte.