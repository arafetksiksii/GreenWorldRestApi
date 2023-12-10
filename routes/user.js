import express from "express";
import { body } from "express-validator";


import {
  getAllUsers,
  addUser,
  getUserById,
  updateUserById,
  deleteUserById,
  updateScoreById,
  resetPassword,
  sendResetCodeByTel,
  sendResetCode,
  updatePassword

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

router.post("/sendResetCode",  sendResetCode);
router.post("/reset", sendResetCodeByTel,body('numeTel').isNumeric);
// Route pour obtenir les détails d'un utilisateur par ID
router.get("/:id", getUserById,);

// Route pour mettre à jour un utilisateur par ID
router.put(
  "/:id",
  updateUserById,
  
);



// Route to update a user's profile by ID
router.put(
  "/updateProfilById",  // New route path
 
  updateScoreById
);

// Route to update a user's profile by ID
router.put(
  "/update",  // New route path
 
  resetPassword
);

// Route pour supprimer un utilisateur par ID
router.delete("/:id", deleteUserById);
router.put('/updatePassword/:id', updatePassword);


export default router;
