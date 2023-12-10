// routes.js

import express from 'express';
import { banUser, unbanUser, banUserWithDuration } from '../controllers/adminController.js';
import { body } from 'express-validator';

const router = express.Router();

// Routes pour le bannissement d'utilisateur
router.put(
  '/users/:id/ban',
  [
    // Ajoutez les validateurs express si nécessaires
    body('durationInMinutes').isInt().withMessage('La durée doit être un nombre entier positif'),
  ],
  banUser
);

router.put('/users/:id/unban', unbanUser);

router.put(
  '/users/:id/banWithDuration',
  [
    // Ajoutez les validateurs express si nécessaires
    body('durationInMinutes').isInt().withMessage('La durée doit être un nombre entier positif'),
  ],
  banUserWithDuration
);

export default router;
