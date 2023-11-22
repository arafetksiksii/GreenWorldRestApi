
import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'; // Assuming you are using bcrypt for password hashing
import User from '../models/user.js'; // Import your user model
import nodemailer from 'nodemailer';
import twilio from 'twilio';

const twilioClient = twilio('ACe97f325708d9f5079f44ba3cfca97f3d', '933ff12e0a2338fc5389e35f30e5396a');


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'aymen.zouaoui@esprit.tn',
    pass: '223AMT0874',
  },
});


const router = express.Router();
// login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials email' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials password' });
    }

    // Generate JWT token
    const token = jwt.sign({ user: { id: user._id, role: user.role } }, 'your-secret-key', { expiresIn: '1h' });

    // Update user with JWT token
    const updatedUser = await User.findByIdAndUpdate(user._id, { token: token }, { new: true });

    // Send the token in the response
    res.json(  updatedUser );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


// Logout route
router.post('/logout', async (req, res) => {
  // Utiliser le middleware d'authentification
  await authenticateUser(req, res);

  try {
    // Obtenir l'identifiant de l'utilisateur connecté
    const userID = req.user.id;

    // Mettre à jour l'utilisateur en supprimant le token
    await User.findByIdAndUpdate(userID, { token: null }, { new: true });

    // Envoyer la réponse de déconnexion
    res.json({ message: 'Logout successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


///




export default router;
