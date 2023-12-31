import Question from '../models/question.js'; // Assurez-vous que le chemin d'importation est correct
import { validationResult } from 'express-validator';

export function getQuestions(req, res) {
    Question
    .find({})
    .then(questions => {
        res.status(200).json(questions);
    })
    .catch(err => {
        res.status(500).json({ error: err });
    });
}

export function addQuestion(req, res) {
    console.log(req.body)
    if (!validationResult(req).isEmpty()) {
        return res.status(400).json({ errors: validationResult(req).array() });
    }

    const newQuestion = {
        id_quiz: req.body.id_quiz,
        question: req.body.question,
        choix: req.body.choix,
        reponse_correcte: req.body.reponse_correcte
    };

    Question
    .create(newQuestion)
    .then(question => {
        res.status(201).json(question);
    })
    .catch(err => {
        res.status(500).json({ error: err });
    });
}

export function getQuestionById(req, res) {
    Question
    .findById(req.params.id_question)
    .then(question => {
        if (!question) {
            return res.status(404).json({ message: 'Question introuvable' });
        }
        res.status(200).json(question);
    })
    .catch(err => {
        res.status(500).json({ error: err });
    });
}

export function updateQuestionById(req, res) {
    if (!validationResult(req).isEmpty()) {
        return res.status(400).json({ errors: validationResult(req).array() });
    }

    const updateData = {
        question: req.body.question,
        choix: req.body.choix,
        reponse_correcte: req.body.reponse_correcte
    };

    Question
    .findByIdAndUpdate(req.params.id_question, updateData, { new: true })
    .then(question => {
        if (!question) {
            return res.status(404).json({ message: 'Question introuvable' });
        }
        res.status(200).json(question);
    })
    .catch(err => {
        res.status(500).json({ error: err });
    });
}



export function getQuestionsByQuizId(req, res) {
    console.log(req.body)
    const quizId = req.params.id_quiz;
    console.log("Requête reçue pour l'ID de quiz:", quizId);

    Question.find({ id_quiz: quizId })
        .then(questions => {
            if (!questions.length) {
                console.log("Aucune question trouvée pour l'ID de quiz:", quizId);
                return res.status(404).json({ message: 'Aucune question trouvée pour ce quiz' });
            }
            console.log(questions.length, "questions trouvées pour l'ID de quiz:", quizId);
            res.status(200).json(questions);
        })
        .catch(err => {
            console.error("Erreur lors de la recherche de questions:", err);
            res.status(500).json({ error: err });
        });
}


export function deleteQuestionById(req, res) {
    Question
    .findByIdAndRemove(req.params.id_question)
    .then(result => {
        if (!result) {
            return res.status(404).json({ message: 'Question introuvable' });
        }
        res.status(200).json({ message: 'Question supprimée avec succès' });
    })
    .catch(err => {
        res.status(500).json({ error: err });
    });
}





