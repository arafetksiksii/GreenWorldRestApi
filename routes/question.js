import express from "express";
import { body } from "express-validator";

import {
  getQuestions,
  addQuestion,
  getQuestionById,
  updateQuestionById,
  deleteQuestionById,
  
} from "../controllers/question.js"; // Assurez-vous d'importer les bonnes fonctions du controller

const router = express.Router();

// Route pour obtenir toutes les questions
router.get("/", getQuestions);

// Route pour ajouter une nouvelle question
router.post(
  "/",
  body("question").notEmpty(),
  body("choix").notEmpty(),
  body("reponse_correcte").notEmpty(),
  addQuestion
);

// Route pour obtenir une question spécifique par son ID
router.get("/:id_question", getQuestionById);

// Route pour mettre à jour une question par ID
router.put(
  "/:id_question",
  body("question").notEmpty(),
  body("choix").notEmpty(),
  body("reponse_correcte").notEmpty(),
  updateQuestionById
);

// Route pour supprimer une question par ID
router.delete("/:id_question", deleteQuestionById);

export default router;
