//middleware qui prendra le token envoyé par le client, en vérifiera la validité, et permettra aux routes d'en exploiter les informations (userId)

const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => { // pour authentifier l'utilisateur via son token.
    try { //on récupère le token
        const token = req.headers.authorization.split(' ')[1]; // on récupère le header, on le split (divise la chaine de caract dans un tableau autour de l'espace qui se trouve entre mot-clé "bearer" et le token. On on veut récupérer le token en position [1])
        const decodedToken = jwt.verify(token, 'test782voilacommecaonverra903'); //on va décoder le token avec méthode verify de jwt
        const userId = decodedToken.userId; //on récupère l'userId grâce au token
        req.auth = {        // on ajoute à l'objet request le userId dans un objet auth qu'on crée.
            userId: userId
        };
        next();
    } catch(error) {
        res.status(401).json({ error });
    }
};