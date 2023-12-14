// fichier : controllers/resultatQuiz.js

import ResultatQuiz from '../models/resultatQuiz.js';
import Question from '../models/question.js';

export function getResultats(req, res) {
  ResultatQuiz.find()
    .then(resultats => res.status(200).json(resultats))
    .catch(err => res.status(500).json({ error: err }));
}

export function addResultat(req, res) {
  ResultatQuiz.create(req.body)
    .then(resultat => res.status(201).json(resultat))
    .catch(err => res.status(500).json({ error: err }));
}

export function getResultatById(req, res) {
  ResultatQuiz.findById(req.params.id)
    .then(resultat => {
      if (!resultat) {
        return res.status(404).json({ message: 'Resultat introuvable' });
      }
      res.status(200).json(resultat);
    })
    .catch(err => res.status(500).json({ error: err }));
}

export function updateResultatById(req, res) {
  ResultatQuiz.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then(resultat => {
      if (!resultat) {
        return res.status(404).json({ message: 'Resultat introuvable' });
      }
      res.status(200).json(resultat);
    })
    .catch(err => res.status(500).json({ error: err }));
}

export function deleteResultatById(req, res) {
  ResultatQuiz.findByIdAndRemove(req.params.id)
    .then(resultat => {
      if (!resultat) {
        return res.status(404).json({ message: 'Resultat introuvable' });
      }
      res.status(200).json({ message: 'Resultat supprimé avec succès' });
    })
    .catch(err => res.status(500).json({ error: err }));
}



export function submitQuiz(req, res) {
  // Les réponses de l'utilisateur sont supposées être envoyées sous ce format :
  // [{ questionId: '...', reponse_user: '...' }, ...]
  const userAnswers = req.body.reponses_user;
  let score = 0;

  // Trouver toutes les questions concernées pour obtenir les bonnes réponses
  const questionIds = userAnswers.map(answer => answer.questionId);

  Question.find({ '_id': { $in: questionIds } })
    .then(questions => {
      questions.forEach(question => {
        // Trouver la réponse correspondante de l'utilisateur
        const userAnswer = userAnswers.find(answer => answer.questionId.equals(question._id));
        if (userAnswer && userAnswer.reponse_user === question.reponse_correcte) {
          score += 1; // ou un autre système de points
        }
      });

      // Créer et sauvegarder le résultat du quiz avec le score
      const resultat = new ResultatQuiz({
        id_user: req.body.id_user,
        id_quiz: req.body.id_quiz,
        score: score,
        reponses_user: userAnswers
      });

      return resultat.save();
    })
    .then(resultat => res.status(201).json(resultat))
    .catch(err => res.status(500).json({ error: err }));
}

