
import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'; // Assuming you are using bcrypt for password hashing
import User from '../models/user.js'; // Import your user model
import { authenticateUser, authorizeAdmin } from '../middlewares/authMiddleware.js';
const router = express.Router();


router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials email' });
    }

    // Check if the user is banned and if banExpirationDate is passed
    if (user. isBannedTemp && user.banExpirationDate && new Date() > user.banExpirationDate) {
      // If banExpirationDate is passed, unban the user
      user. isBannedTemp = false;
      user.banExpirationDate = null;
      await user.save();
    }

    // Check if the user is banned after potential unban
    if (user.isBanned) {
      return res.status(401).json({ message: 'User is banned' });
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
    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



// Logout route
router.post('/logout', authenticateUser, async (req, res) => {
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

router.post('/loginiios', async (req, res) => {
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
    await User.findByIdAndUpdate(user._id, { token: token });
   
    // Send the token in the response along with user details
    res.json({
      user: {
        _id: user._id,
        email: user.email,
        nom: user.nom,
        prenom: user.prenom,
        // Include other user details as needed
      },
      token: token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/loggeduser', authenticateUser, async (req, res) => {
  try {
    const userID = req.user.id;
    const user = await User.findById(userID);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Send only necessary user data, not the entire user object
    const userData = {
      id: user._id,
      email: user.email,
      nom: user.nom,
      prenom: user.prenom,
      imageRes:user.imageRes,
      userName:user.userName
      // Add other necessary fields
    };

    res.json( userData );
  } catch (error) {
    console.error('Error fetching logged-in user:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
  }
});
  

export default router;
