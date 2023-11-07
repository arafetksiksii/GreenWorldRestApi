import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan'; // Importer morgan
import cors from 'cors'; // Importer cors
import { notFoundError, errorHandler } from './middlewares/error-handler.js';
import eventRoutes from './routes/event.js';

const app = express();
const databaseName = 'GreenWorld';
const port = process.env.PORT || 9090;
mongoose
  .connect(`mongodb://127.0.0.1:27017/${databaseName}`)
  .then(() => {
    console.log(`connection successful`);
  })
  .catch(err => {
    console.log('something wrong',err);
  });
  mongoose.Promise = global.Promise;
  mongoose.set('debug', true);

app.use(cors()); // Utiliser CORS
app.use(morgan('dev')); // Utiliser morgan
app.use(express.json()); // Pour analyser application/json
app.use(express.urlencoded({ extended: true })); // Pour analyser application/x-www-form-urlencoded
app.use('/img', express.static('public/images')); // Servir les fichiers sous le dossier public/images

// A chaque requête, exécutez ce qui suit
app.use((req, res, next) => {
  console.log("Middleware just ran !");
  next();
});
// Sur toute demande à /gse, exécutez ce qui suit
app.use('/evt', (req, res, next) => {
    console.log("Middleware just ran on a gse route !");
    next();
  });
  app.use('/event', eventRoutes);
// Utiliser le middleware de routes introuvables
app.use(notFoundError);
// Utiliser le middleware gestionnaire d'erreurs
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
  });