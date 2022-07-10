const express = require('express');

const router = express.Router(); // on crée un router via express (méthode .Router)

const userCtrl = require('../controllers/user');

router.post('/signup', userCtrl.createUser);
router.post('/login', userCtrl.userConnexion);

module.exports = router;