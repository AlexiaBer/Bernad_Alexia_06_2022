const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router(); // on crée un router via express (méthode .Router)
const multer = require('../middleware/multer-config');
const sauceCtrl = require('../controllers/sauce');

router.get('/', auth, sauceCtrl.saucesList);
router.get('/:id', auth, sauceCtrl.findOneSauce);
router.post('/', auth, multer, sauceCtrl.createSauce);
//router.put('sauces/:id', auth, multer, sauceCtrl.modifySauce);
//router.delete('sauces/:id', auth, sauceCtrl.deleteSauce);
//router.post('/sauces/:id/like', auth, sauceCtrl.likeSauce);

module.exports = router;