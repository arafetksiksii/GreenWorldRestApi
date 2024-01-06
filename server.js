import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import cors from 'cors';
import { notFoundError, errorHandler } from './middlewares/error-handler.js';
import produitRoutes from './routes/produit.js';
import commandeRoutes from './routes/commande.js';
import favproduitRoutes from './routes/favproduit.js';
import quizRoutes from './routes/quiz.js';
import questionRoutes from './routes/question.js';
import resultatQuizRoutes from './routes/resultatQuiz.js';
import userRoutes from './routes/user.js';
import pointCollectRoutes from './routes/pointCollect.js';
import dechetsRoutes from './routes/dechets.js';
import TypeRoutes from './routes/type.js';
import eventRoutes from './routes/event.js';
import CommentRoute from './routes/comment.js';
import bodyParser from 'body-parser';
import authController from './controllers/authController.js';
import  reservationRoutes from './routes/reservation.js';  // Assurez-vous que le chemin est correct
import   adminRoutes from './routes/adminRoutes.js';
import chacontroller from './controllers/chatgpt.js'

import   statRoutes from './routes/statistiques.js';

import swaggerUi from 'swagger-ui-express';
import specs from './swagger.js'; // Importez le fichier de configuration Swagger


const app = express();
app.use(bodyParser.json());
const port = process.env.PORT || 9090;
const databaseName = 'GreenWorld';
const db_url = process.env.DB_URL || `mongodb://127.0.0.1:27017`;

mongoose.set('debug', true);
mongoose.Promise = global.Promise;

mongoose
  .connect(`${db_url}/${databaseName}`)
  .then(() => {
    console.log(`Connected to ${databaseName}`);
  })
  .catch(err => {
    console.log(err);
  });

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/',chacontroller)

// Routes
app.use('/img', express.static('public/images'));
app.use('/auth', authController); // Ajout de la route d'authentification
app.use('/', chatcontroller); //
app.use('/admin',adminRoutes)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use('/user', userRoutes);
app.use('/produit', produitRoutes);
app.use('/commande', commandeRoutes);
app.use('/favproduit', favproduitRoutes);
app.use('/type', TypeRoutes);
app.use('/point',pointCollectRoutes); 
app.use('/dechets', dechetsRoutes);
app.use('/quiz', quizRoutes);
app.use('/question', questionRoutes);
app.use('/resultatQuiz', resultatQuizRoutes);
app.use('/event', eventRoutes);
app.use('/comment', CommentRoute);
app.use('/stat', statRoutes);

app.use('/api', reservationRoutes);  // Vous pouvez ajuster le préfixe '/api' en fonction de vos besoins
app.use(notFoundError);
app.use(errorHandler);
// Sur toute demande à /gse, exécutez ce qui suit
app.use('/evt', (req, res, next) => {
  console.log("Middleware just ran on a gse route !");
  next();  
});
app.listen(port, () => {
  console.log(`Server running at http://localhost::${port}/`);
});  
  
