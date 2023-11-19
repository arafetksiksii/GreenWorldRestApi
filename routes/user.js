import express from "express";
import { body } from "express-validator";


import {
  getAllUsers,
  addUser,
  getUserById,
  updateUserById,
  deleteUserById,
  updateScoreById,

} from "../controllers/user.js"; // Assurez-vous d'importer les bonnes fonctions du controller

const router = express.Router();

// Route pour obtenir la liste de tous les utilisateurs
router.get("/", getAllUsers);

// Route pour créer un nouvel utilisateur
router.post(
  "/",
  
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  addUser
);

// Route pour obtenir les détails d'un utilisateur par ID
router.get("/:id", getUserById,);


// Route to update a user's profile by ID
router.put(
  "/updateProfilById",  // New route path
 
  updateScoreById
);

// Route pour supprimer un utilisateur par ID
router.delete("/:id", deleteUserById);



export default router;
