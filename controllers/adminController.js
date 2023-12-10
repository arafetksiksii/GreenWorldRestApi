import { validationResult } from 'express-validator';
import User from '../models/user.js';
import { authenticateUser, authorizeAdmin } from '../middlewares/authMiddleware.js';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import { uploadImage } from '../middlewares/mm.js';
import twilio from 'twilio';
import jwt from 'jsonwebtoken';
import e from 'cors';



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