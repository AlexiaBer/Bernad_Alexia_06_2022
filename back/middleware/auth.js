const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; // on récupère le header, on le split (divise la chaine de caract dans un tableau autour de l'espace qui se trouve entre mot-clé "bearer" et le token. On on veut récupérer le token en position [1])
        const decodedToken = jwt.verify(token, 'test782voilacommecaonverra903'); //on va décoder le token avec méthode verify de jwt
        const userId = decodedToken.userId;
        req.auth = {
            userId: userId
        };
    } catch(error) {
        res.status(401).json({ error });
    }
};