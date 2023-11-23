import express from "express";
import { body } from "express-validator";

import {
    getAllQuiz,
    addOnceQuiz,
    getQuizByName,
    updateQuizByName,
  deleteQuizById,
  
} from "../controllers/quiz.js"; // Assurez-vous d'importer les bonnes fonctions du controller

const router = express.Router();

// Route pour obtenir la liste de tous les utilisateurs
router.get("/", getAllQuiz);

// Route pour créer un nouvel utilisateur
router.post(
  "/",
  body("nom_quiz").isLength({ min: 5 }),
  body("description_quiz").isLength({ max: 50 }),
  addOnceQuiz
);

router.get("/:nom_quiz", getQuizByName);

// Route pour mettre à jour un utilisateur par ID
router.put(
  "/:nom_quiz",
  body("nom_quiz").isLength({ min: 5 }),
  body("description_quiz").isLength({ max: 50 }),
  updateQuizByName
);

export default router;