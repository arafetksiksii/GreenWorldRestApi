
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

// Add this route to your router
router.post('/forgetpassword', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Choose either email or SMS to send the reset code
    // Uncomment the desired method (email or SMS)

    // Email method
    /*
    const resetToken = jwt.sign({ email, resetCode: generateResetCode() }, 'your-reset-secret-key', { expiresIn: '15m' });
    const mailOptions = {
      from: 'your-email@gmail.com',
      to: email,
      subject: 'Password Reset Code',
      text: `Your password reset code is: ${resetToken}`,
    };
    transporter.sendMail(mailOptions, (emailError, info) => {
      if (emailError) {
        console.error(emailError);
        return res.status(500).json({ error: 'Error sending reset code via email' });
      }
      console.log('Reset code sent via email:', resetToken);
      res.status(200).json({ message: 'Reset code sent successfully' });
    });
    */

    // SMS method
    const resetCode = generateResetCode();
    await twilioClient.messages.create({
      body: `Your password reset code is: ${resetCode}`,
      from: '21695398941',
      to: user.numTel,
    });

    console.log('Reset code sent via SMS:', resetCode);
    user.resetCode = resetCode;
    await user.save();
    
    res.status(200).json({ message: 'Reset code sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



export default router;
