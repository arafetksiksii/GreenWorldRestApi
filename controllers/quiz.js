import Quiz from '../models/quiz.js';
import { validationResult } from 'express-validator'; // Importer express-validator


export function getAllQuiz(req, res) {
    Quiz
    .find({})
    
    .then(docs => {
        res.status(200).json(docs);
    })
    .catch(err => {
        res.status(500).json({ error: err });
    });
}


export function addOnceQuiz(req, res) {
    // Invoquer la méthode create directement sur le modèle
    if (!validationResult(req).isEmpty()){
        res.status(400).json({errors: validationResult(req).array()})
    }
    else {
        Quiz
    .create({
        nom_quiz: req.body.nom_quiz,
        description_quiz: req.body.description_quiz
    })
    .then(newQuiz => {
        res.status(200).json(newQuiz);
    })
    .catch(err => {
        res.status(500).json({ error: err });
    });
}
}

export function getQuizByName(req, res) {
    Quiz.findOne({ nom_quiz: req.params.nom_quiz })
        .then((quiz) => {
            if (!quiz) {
                res.status(404).json({ message: 'Quiz introuvable' });
            } else {
                res.status(200).json(quiz);
            }
        })
        .catch((err) => {
            res.status(500).json({ error: err });
        });
}

  
  export function updateQuizByName(req, res) {
    if (!validationResult(req).isEmpty()) {
        res.status(400).json({ errors: validationResult(req).array() });
    } else {
        const updatedQuizData = {
            nom_quiz: req.body.nom_quiz,
            description_quiz: req.body.description_quiz
        };

        // Utilisez findOneAndUpdate avec le nom du quiz comme critère de recherche
        Quiz.findOneAndUpdate(
            { nom_quiz: req.params.nom_quiz }, // Critère de recherche basé sur le nom
            updatedQuizData,
            { new: true } // Retourne le document mis à jour
        )
        .then((updatedQuiz) => {
            if (!updatedQuiz) {
                res.status(404).json({ message: 'Quiz introuvable' });
            } else {
                res.status(200).json(updatedQuiz);
            }
        })
        .catch((err) => {
            res.status(500).json({ error: err });
        });
    }
}

  
  export function deleteQuizById(req, res) {
    Quiz.findByIdAndRemove(req.params.nom_quiz)
      .then((quiz) => {
        if (!quiz) {
          res.status(404).json({ message: 'Quiz introuvable' });
        } else {
          res.status(200).json({ message: 'Quiz supprimé avec succès' });
        }
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  }s