import { validationResult } from 'express-validator';
import User from '../models/user.js';
import { authenticateUser, authorizeAdmin } from '../middlewares/authMiddleware.js';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import { uploadImage } from '../middlewares/mm.js';
import twilio from 'twilio';
import jwt from 'jsonwebtoken';
import e from 'cors';
import openai from 'openai';
// Make sure you have configured your openai API key
const openaiApiKey = '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';
openai.apiKey = openaiApiKey;
console.log(openai.apiKey); 
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'aymen.zouaoui@esprit.tn',
    pass: '223AMT0874a',
  },
});
export async function newPassword(req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update the user's password
    user.password = await bcrypt.hash(newPassword, 10);

    await user.save();

    // Send a thank-you email using ChatGPT
    const thankYouEmailPrompt = `Dear ${user.username},\n\nWe would like to thank you for updating your password. If you have any questions or concerns, please feel free to contact us.`;

    console.log(openai); // Check the value of openai

    const response = await openai.Completion.create({
      engine: 'text-davinci-003',
      prompt: thankYouEmailPrompt,
      max_tokens: 200,
    });

    const thankYouEmailContent = response.choices[0].text;

    const mailOptions = {
      from: 'your-email@example.com',
      to: user.email,
      subject: 'Thank You for Updating Your Password',
      text: thankYouEmailContent,
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: 'Password updated successfully. Thank you email sent.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
export async function banUser(req, res) {
    const userId = req.params.id; // ou tout autre moyen d'obtenir l'ID de l'utilisateur à bannir
  
    try {
      // Recherchez l'utilisateur dans la base de données
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: 'Utilisateur introuvable' });
      }
  
      // Vérifiez si l'utilisateur est déjà banni
      if (user.isBanned) {
        return res.status(400).json({ message: 'Utilisateur déjà banni' });
      }
  
      // Marquez l'utilisateur comme banni
      user.isBanned = true;
      
      // Sauvegardez les modifications dans la base de données
      await user.save();
  
      res.status(200).json({ message: 'Utilisateur banni avec succès' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  export async function unbanUser(req, res) {
    const userId = req.params.id; // ou tout autre moyen d'obtenir l'ID de l'utilisateur à débannir
  
    try {
      // Recherchez l'utilisateur dans la base de données
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: 'Utilisateur introuvable' });
      }
  
      // Vérifiez si l'utilisateur est déjà débanni
      if (!user.isBanned) {
        return res.status(400).json({ message: 'Utilisateur n\'est pas banni' });
      }
  
      // Marquez l'utilisateur comme débanni
      user.isBanned = false;
      
      // Sauvegardez les modifications dans la base de données
      await user.save();
  
      res.status(200).json({ message: 'Utilisateur débanni avec succès' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }


  // Fonction pour bannir un utilisateur pour une durée définie
export async function banUserWithDuration(req, res) {
    const userId = req.params.id; // ou tout autre moyen d'obtenir l'ID de l'utilisateur à bannir
    const banDurationInMinutes = req.body.durationInMinutes; // La durée du bannissement en minutes
  
    try {
      // Recherchez l'utilisateur dans la base de données
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: 'Utilisateur introuvable' });
      }
  
      // Vérifiez si l'utilisateur est déjà banni
      if (user.isBanned) {
        return res.status(400).json({ message: 'Utilisateur déjà banni' });
      }
  
      // Obtenez la date actuelle
      const currentDate = new Date();
  
      // Calculez la date d'expiration du bannissement en ajoutant la durée à la date actuelle
      const banExpirationDate = new Date(currentDate.getTime() + banDurationInMinutes * 60000);
  
      // Marquez l'utilisateur comme banni avec la date d'expiration
      user. isBannedTemp = true;
      user.banExpirationDate = banExpirationDate;
  
      // Sauvegardez les modifications dans la base de données
      await user.save();
  
      res.status(200).json({
        message: 'Utilisateur banni avec succès pour une durée définie',
        banExpirationDate: banExpirationDate,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }


  export async function getBannedUsers(req, res) {
    console.log("getBannedUsers")
    try {
      // Find all users that are currently banned
      const bannedUsers = await User.find({ isBanned: true });
  
      res.status(200).json(bannedUsers);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  export async function verifyResetCode(req, res) {
   console.log(req.body)
   console.log("eeeeeeeeeeeeee")
    const errors = validationResult(req);
  
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    const { email, resetCode } = req.body;
  
    try {
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      if (user.resetCode !== resetCode) {
        return res.status(400).json({ message: 'Invalid reset code' });
      }
  
     
      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }



