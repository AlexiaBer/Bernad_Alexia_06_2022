const express = require('express');
const auth = require('auth');
const router = express.Router(); // on crée un router via express (méthode .Router)

const sauceCtrl = require('../controllers/sauce');

router.get('/sauces', auth, sauceCtrl.saucesList);
router.get('sauces/:id', auth, sauceCtrl.findOneSauce);
router.post('/sauces', auth, sauceCtrl.createSauce);
router.put('sauces/:id', auth, sauceCtrl.modifySauce);
router.delete('sauces/:id', auth, sauceCtrl.deleteSauce);
router.post('/sauces/:id/like', auth, sauceCtrl.likeSauce);

module.exports = router;