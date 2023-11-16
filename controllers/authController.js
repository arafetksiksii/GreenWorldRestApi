
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
function generateResetCode() {
  return Math.floor(10000 + Math.random() * 90000);
}

const router = express.Router();
//Login route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

console.log('Received credentials:', email, password);

try {
  const user = await User.findOne({ email });

  console.log('User found:', user);
  
  if (!user) {
    console.log('User not found:', email);
    return res.status(401).json({ message: 'Invalid credentials email' });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  console.log('Password comparison result:', isPasswordValid);
 

  if (!isPasswordValid) {
    console.log('Invalid password for user:', email);
    return res.status(401).json({ message: 'Invalid credentials password' });
  }

 // Generate JWT token
 const token = jwt.sign({ user: { id: user._id, role: user.role } }, 'your-secret-key', { expiresIn: '1h' });

 // Log the generated token
 console.log('JWT token:', token);

 // Send the token in the response
 res.json(user);
} catch (error) {
 console.error(error);
 res.status(500).json({ message: 'Internal Server Error' });
}
});



// Logout route
router.post('/logout', (req, res) => {
  
  res.json({ message: 'Logout successful' });
});


///


export async function verifyResetCode(req, res) {
  const errors = validationResult(req);

  const { email, resetCode, token, newPassword } = req.body;

  try {
    // Find the user by email, reset code, and token
    const user = await User.findOne({ email, resetCode, resetToken: token });

    if (!user) {
      return res.status(401).json({ message: 'Invalid reset code, token, or email' });
    }

    // Check if the token is expired
    const decodedToken = jwt.verify(token, 'your-reset-secret-key');
    if (Date.now() >= decodedToken.exp * 1000) {
      return res.status(401).json({ message: 'Token expired' });
    }

    // Update the user's password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    // Clear the reset code and token from the user in the database
    user.resetCode = undefined;
    user.resetToken = undefined;
    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}


/////

/*
export async function sendResetCode(req, res) {
  const errors = validationResult(req);

  const { email } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate a 5-digit reset code
    const resetCode = generateResetCode();

    // Generate a JWT token
    const token = jwt.sign({ email, resetCode }, 'your-reset-secret-key', { expiresIn: '15m' }); // Set an appropriate expiration time

    // Save the reset code and token to the user document
    user.resetCode = resetCode;
    user.resetToken = token;
    await user.save();

    // Send the reset code and token via email
    const mailOptions = {
      from: 'your-email@gmail.com',
      to: email,
      subject: 'Password Reset Code',
      text: `Your password reset code is: ${resetCode}. Use the following token for verification: ${token}`,
    };

    transporter.sendMail(mailOptions, (emailError, info) => {
      if (emailError) {
        console.error(emailError);
        return res.status(500).json({ error: 'Error sending reset code via email' });
      }

      console.log('Reset code and token sent via email:', resetCode, token);
      res.status(200).json({ message: 'Reset code and token sent successfully' });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
*/
export async function sendResetCode(req, res) {
  const errors = validationResult(req);

  const { email } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get the user's phone number
    const numTel = user.numTel;

    // Generate a 5-digit reset code
    const resetCode = generateResetCode();

    // Save the reset code to the user document
    user.resetCode = resetCode;
    await user.save();

    // Send the reset code via SMS using Twilio
    await twilioClient.messages.create({
      body: `Your password reset code is: ${resetCode}`,
      from: 'your-twilio-phone-number',
      to: numTel,
    });

    console.log('Reset code sent via SMS:', resetCode);
    res.status(200).json({ message: 'Reset code sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
export default router;
