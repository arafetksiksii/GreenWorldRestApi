// auth.js
import express from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/user.js'; // Assurez-vous que le chemin du fichier est correct
import nodemailer from 'nodemailer';

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

    const { email,resetCode } = req.body;

    try {
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const resetCode = generateResetCode();

      const mailOptions = {
        from: 'your-email@gmail.com',
        to: email,
        subject: 'Password Reset Code',
        text: `Your password reset code is: ${resetCode}`,
      };

      transporter.sendMail(mailOptions, (emailError, info) => {
        if (emailError) {
          console.error(emailError);
          return res.status(500).json({ error: 'Error sending reset code via email' });
        }

        console.log('Reset code sent via email:', resetCode);

        // Save the reset code in the user document
        user.resetCode = resetCode;
        user.save();

        // Return the user along with the reset code
        res.json(user);
      });
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
function generateResetCode() {
  return Math.floor(1000 + Math.random() * 9000);
}
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'aymen.zouaoui@esprit.tn',
    pass: '223AMT0874',
  },
});
export default router;
