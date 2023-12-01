
/*import express from 'express';
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
    if (user.isBannedTemp && user.banExpirationDate && new Date() > user.banExpirationDate) {
      // If banExpirationDate is passed, unban the user
      user.isBannedTemp = false;
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
    
    });

  
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
      imageRes: user.imageRes,
      userName: user.userName
      // Add other necessary fields
    };

    res.json(userData);
  } catch (error) {
    console.error('Error fetching logged-in user:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
  }
});



export default router;


*/import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/user.js';
import DailyStats from '../models/DailyStats.js'; // Import the DailyStats model
import { authenticateUser } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials email' });
    }
    if (user.isBannedTemp && user.banExpirationDate && new Date() > user.banExpirationDate) {
  
      user.isBannedTemp = false;
      user.banExpirationDate = null;
      await user.save();
    }
    if (user.isBanned) {
      return res.status(401).json({ message: 'User is banned' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials password' });
    }

    const loginDate = new Date();
    await DailyStats.findOneAndUpdate(
      {
        userId: user._id,
        date: {
          $gte: new Date(loginDate.getFullYear(), loginDate.getMonth(), loginDate.getDate()),
          $lt: new Date(loginDate.getFullYear(), loginDate.getMonth(), loginDate.getDate() + 1),
        },
      },
      {
        $inc: { loginCount: 1 },
        $set: { date: loginDate },
      },
      { upsert: true }
    );
   
    user.lastLoginTimestamp = loginDate;
    await user.save();
    user.loginCount += 1;
    const token = jwt.sign({ user: { id: user._id, role: user.role } }, 'your-secret-key', { expiresIn: '1h' });
    const updatedUser = await User.findByIdAndUpdate(user._id, { token: token, loginCount: user.loginCount });
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
      // Calculate the time spent during this session
      const lastLogoutTimestamp = new Date();
      const timeSpent = lastLogoutTimestamp - user.lastLoginTimestamp;

      // Record the time spent and logout timestamp in DailyStats collection
      const logoutDate = new Date();
      await DailyStats.findOneAndUpdate(
        {
          userId: user._id,
          date: {
            $gte: new Date(logoutDate.getFullYear(), logoutDate.getMonth(), logoutDate.getDate()),
            $lt: new Date(logoutDate.getFullYear(), logoutDate.getMonth(), logoutDate.getDate() + 1),
          },
        },
        {
          $inc: { timeSpent: timeSpent },
          $set: { date: logoutDate },
        },
        { upsert: true }
      );

      // Increment totalTimeSpent for the user
      user.totalTimeSpent += timeSpent;

      // Clear the user's token (log them out)
      await User.findByIdAndUpdate(userID, { token: null, totalTimeSpent: user.totalTimeSpent });

      res.json({ message: 'Logout successful' });
    } else {
      res.status(401).json({ message: 'User not logged in or login timestamp missing' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



// Get logged-in user route
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
      imageRes: user.imageRes,
      userName: user.userName,
      // Add other necessary fields
    };

    res.json(userData);
  } catch (error) {
    console.error('Error fetching logged-in user:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
  }
});

router.post('/loginiios', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials email' });
    }
    // Check if the user is banned and if banExpirationDate is passed
    if (user.isBannedTemp && user.banExpirationDate && new Date() > user.banExpirationDate) {
      // If banExpirationDate is passed, unban the user
      user.isBannedTemp = false;
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

    // Record login information in DailyStats collection
    const loginDate = new Date();
    await DailyStats.findOneAndUpdate(
      {
        userId: user._id,
        date: {
          $gte: new Date(loginDate.getFullYear(), loginDate.getMonth(), loginDate.getDate()),
          $lt: new Date(loginDate.getFullYear(), loginDate.getMonth(), loginDate.getDate() + 1),
        },
      },
      {
        $inc: { loginCount: 1 },
        $set: { date: loginDate },
      },
      { upsert: true }
    );
    user.lastLoginTimestamp = loginDate;
    await user.save();
    // Increment loginCount for the updatedUser
    user.loginCount += 1;

    // Generate JWT token
    const token = jwt.sign({ user: { id: user._id, role: user.role } }, 'your-secret-key', { expiresIn: '1h' });

    // Update user with JWT token
    await User.findByIdAndUpdate(user._id, {
      token: token,
      loginCount: user.loginCount,
    });

    // Send the token in the response along with user details
    res.json({
      user: {
        _id: user._id,
        email: user.email,
        nom: user.nom,
        prenom: user.prenom,
        token: token,
        // Include other user details as needed
      },
      token: token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});






async function getUserDailyStats(userId, date) {
  const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);

  const userStats = await DailyStats.findOne({
    userId: userId,
    date: { $gte: startOfDay, $lt: endOfDay },
  });

  return userStats || { loginCount: 0, timeSpent: 0 };
}

async function getUserGlobalStatsuser(userId) {
  try {
    // Find the user by userId
    const user = await User.findById(userId);

    if (!user) {
      // Handle the case where the user is not found
      return { loginCount: 0, totalTimeSpent: 0 };
    }

    // Extract totalLoginCount and totalTimeSpent from the user model
    const { loginCount, totalTimeSpent } = user;

    // Create an object to hold the global stats
    const globalStats = {
      totalLoginCount: loginCount || 0, // Use 0 as the default value if undefined
      totalTimeSpent: totalTimeSpent || 0, // Use 0 as the default value if undefined
    };

    return globalStats;
  } catch (error) {
    console.error('Error fetching user global stats:', error);
    return { totalLoginCount: 0, totalTimeSpent: 0 };
  }
}
// Function to get user daily stats
router.get('/userdailystats/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const date = new Date();

    const userDailyStats = await getUserDailyStats(userId, date);
    res.json(userDailyStats);
  } catch (error) {
    console.error('Error fetching user daily stats:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
  }
});

// Function to get user global stats
router.get('/userglobalstats/:id', async (req, res) => {
  try {
    const userId = req.params.id;

    const userGlobalStats = await getUserGlobalStatsuser(userId);
    res.json({ userGlobalStats });
  } catch (error) {
    console.error('Error fetching user global stats:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
  }
});



async function getAllUsersGlobalStats() {
  const globalStats = await DailyStats.aggregate([
    {
      $group: {
        _id: null,
        totalLoginCount: { $sum: '$loginCount' },
        totalTimeSpent: { $sum: '$timeSpent' },
      },
    },
  ]);

  if (globalStats.length > 0) {
    return globalStats[0];
  } else {
    return { totalLoginCount: 0, totalTimeSpent: 0 };
  }
}
// Route to get global stats for all users
router.get('/allusersstats', async (req, res) => {
  try {
    const globalStats = await getAllUsersGlobalStats();

    res.json({ globalStats });
  } catch (error) {
    console.error('Error fetching all users stats:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
  }
});
export default router;

