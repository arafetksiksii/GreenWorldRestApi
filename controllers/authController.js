
import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'; // Assuming you are using bcrypt for password hashing
import User from '../models/user.js'; // Import your user model
import { authenticateUser, authorizeAdmin } from '../middlewares/authMiddleware.js';
const router = express.Router();
import LoginEvent from '../models/loginEvent.js';

   




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
    const updatedUser = await User.findByIdAndUpdate(user._id, { 
      token: token, 
      lastLoginTimestamp: new Date(),
      lastLogoutTimestamp: null
    });

     // Log the login event in a separate collection
     const loginEvent = new LoginEvent({
      userId: user._id,
      timestamp: new Date(),
    });
    await loginEvent.save();
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
    const userID = req.user.id;
    const user = await User.findById(userID);

    if (user && user.lastLoginTimestamp) {
      const lastLogoutTimestamp = new Date();
      const timeSpent = lastLogoutTimestamp - user.lastLoginTimestamp;

      await User.findByIdAndUpdate(userID, { 
        token: null,
        lastLogoutTimestamp: lastLogoutTimestamp,
        $inc: { totalTimeSpent: timeSpent }
      });

      res.json({ message: 'Logout successful' });
    } else {
      res.status(400).json({ message: 'User not logged in or login timestamp missing' });
    }
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
    await User.findByIdAndUpdate(user._id, { 
      token: token, 
      lastLoginTimestamp: new Date(),
      lastLogoutTimestamp: null
    });
   
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
  


router.get('/login-stats', async (req, res) => {
  try {
    const loginStats = await User.aggregate([
      {
        $match: { lastLoginTimestamp: { $exists: true } }
      },
      {
        $group: {
          _id: {
            userId: "$_id",
            year: { $year: "$lastLoginTimestamp" },
            month: { $month: "$lastLoginTimestamp" },
            day: { $dayOfMonth: "$lastLoginTimestamp" },
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 }
      }
    ]);

    res.json(loginStats);
  } catch (error) {
    console.error('Error fetching login statistics:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


// Assuming this is in your router file (e.g., authRoutes.js)

router.get('/login-statss', async (req, res) => {
  try {
    const loginStats = await LoginEvent.aggregate([
      {
        $group: {
          _id: {
            userId: "$userId",
            year: { $year: "$timestamp" },
            month: { $month: "$timestamp" },
            day: { $dayOfMonth: "$timestamp" },
          },
          count: { $sum: 1 },
        }
      },
      {
        $group: {
          _id: "$_id.userId",
          loginStats: { $push: { date: "$_id", count: "$count" } },
        }
      }
    ]);

    res.json(loginStats);
  } catch (error) {
    console.error('Error fetching login statistics:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
router.get('/user-stats', async (req, res) => {
  try {
    const userStats = await User.aggregate([
      {
        $lookup: {
          from: 'loginevents', // Use the actual name of your LoginEvent collection
          localField: '_id',
          foreignField: 'userId',
          as: 'loginEvents',
        },
      },
      {
        $unwind: { path: '$loginEvents', preserveNullAndEmptyArrays: true },
      },
      {
        $group: {
          _id: {
            userId: '$_id',
            year: { $year: '$loginEvents.timestamp' },
            month: { $month: '$loginEvents.timestamp' },
            day: { $dayOfMonth: '$loginEvents.timestamp' },
          },
          count: { $sum: 1 },
          totalTimeSpent: { $sum: { $subtract: ['$lastLogoutTimestamp', '$loginEvents.timestamp'] } },
        },
      },
      {
        $group: {
          _id: '$_id.userId',
          loginStats: { $push: { date: '$_id', count: '$count' } },
          totalLogins: { $sum: '$count' },
          totalTimeSpent: { $sum: '$totalTimeSpent' },
        },
      },
    ]);

    res.json(userStats);
  } catch (error) {
    console.error('Error fetching user statistics:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
export default router;



