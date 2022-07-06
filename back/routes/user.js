const express = require('express');

const router = express.Router(); // on crée un router via express (méthode .Router)

const userCtrl = require('../controllers/user');

router.post('/auth/signup', userCtrl.createUser);
router.post('/auth/login', userCtrl.userConnexion);

module.exports = router;