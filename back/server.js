const http = require("http"); // accéder à l'objet http pour créer un serveur
const app = require('./app'); // pour importer le fichier app.js
const normalizePort = val => { // fonction qui renvoie un port valide, qu'il soit fourni sous la forme d'un numéro ou d'une chaîne
  const port = parseInt(val,10);
  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
}; 

const port = normalizePort(process.env.PORT || '3000')
app.set('port', port); // on dit à l'application sur quel port elle va tourner

const errorHandler = error => { // fonction qui recherche les différentes erreurs et les gère de manière appropriée. Elle est ensuite enregistrée dans le serveur
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const server = http.createServer(app);   // méthode createServer du package http. argument de createServer = la fonction qui sera appelée à chaque requête reçue par le serveur.
//on appelle l'app qui sera la fonction exécutée (recevra la requete et la réponse et les modifiera)

server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

server.listen(port); // un écouteur d'évènements est enregistré, consignant le port ou le canal nommé sur lequel le serveur s'exécute dans la console.
console.log(server.address());
