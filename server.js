import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import cors from 'cors';

import { notFoundError, errorHandler } from './middlewares/error-handler.js';

import produitRoutes from './routes/produit.js';
import quizRoutes from './routes/quiz.js';
import questionRoutes from './routes/question.js';
import resultatQuizRoutes from './routes/resultatQuiz.js';



import userRoutes from './routes/user.js'; // Assurez-vous que le chemin du fichier est correct
import dechetsRoutes from './routes/dechets.js';
import demandeRoutes from './routes/demande.js';


const app = express();
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
  app.use('/img', express.static('public/images'));
  app.use('/user', userRoutes); 
  app.use('/produit', produitRoutes);
  
  app.use('/dechets', dechetsRoutes); 
  app.use('/demande', demandeRoutes);
  app.use('/quiz', quizRoutes);
  app.use('/question', questionRoutes);
  app.use('/resultatQuiz', resultatQuizRoutes);





  app.use(notFoundError);
  app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});