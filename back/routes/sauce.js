const express = require('express');

const router = express.Router(); // on crée un router via express (méthode .Router)

const sauceCtrl = require('../controllers/sauce');

router.get('/sauces', sauceCtrl.saucesList);
router.get('sauces/:id', sauceCtrl.findOneSauce);
router.post('/sauces', sauceCtrl.createSauce);
router.put('sauces/:id', sauceCtrl.modifySauce);
router.delete('sauces/:id', sauceCtrl.deleteSauce);
router.post('/sauces/:id/like', sauceCtrl.likeSauce);

module.exports = router;