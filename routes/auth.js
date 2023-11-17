// auth.js
import express from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/user.js'; // Assurez-vous que le chemin du fichier est correct

const router = express.Router();

// ... Autres imports ...

router.post(
  '/sendResetCode',
  body('email').isEmail(),
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;

    try {
      // Logique d'envoi du code de réinitialisation ici
      // Vous pouvez utiliser la bibliothèque nodemailer, twilio, etc.

      res.json({ message: 'Reset code sent successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
);

router.post(
  '/verifyResetCode',
  body('email').isEmail(),
  body('resetCode').isNumeric(),
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, resetCode } = req.body;

    try {
      // Logique de vérification du code de réinitialisation ici
      // Comparer le resetCode avec celui stocké dans la base de données

      const user = await User.findOne({ email });

      if (!user || user.resetCode !== resetCode) {
        return res.status(401).json({ message: 'Invalid reset code' });
      }

      // Générer un nouveau JWT token pour la réinitialisation du mot de passe
      const token = jwt.sign({ email, resetCode }, 'your-reset-secret-key', { expiresIn: '15m' });

      res.json({ message: 'Reset code verified successfully', token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
);

export default router;
