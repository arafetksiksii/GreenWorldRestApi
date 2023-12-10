import { validationResult } from 'express-validator';
import User from '../models/user.js';
import { authenticateUser, authorizeAdmin } from '../middlewares/authMiddleware.js';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import { uploadImage } from '../middlewares/mm.js';
import twilio from 'twilio';
import jwt from 'jsonwebtoken';
import e from 'cors';
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'aymen.zouaoui@esprit.tn',
    pass: '223AMT0874',
  },
});

const accountSid = 'ACe97f325708d9f5079f44ba3cfca97f3d';
const authToken = '7a3001c6bf1c52995b3d22846d74f02c';
const client = twilio(accountSid, authToken);
//recover all users
export function getAllUsers(req, res) {

  authenticateUser(req, res, () => {
    User.find({})
      .then((users) => {
        let userList = users.map((user) => {
          return {
            id: user._id,
            email: user.email,
            nom: user.nom,
            prenom: user.prenom,
            dateNaissance: user.dateNaissance,
            adress: user.adress,
            cin: user.cin,
            userName: user.userName,
            lastPassword: user.lastPassword,
            isValid: user.isValid,
            imageRes: user.imageRes,
            role: user.role,
            numTel: user.numTel,
          };
        });
        res.status(200).json(userList);
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  });

}
// add user

export async function addUser(req, res) {

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      email,
      password,
      nom,
      prenom,
      dateNaissance,
      adress,
      cin,
      userName,
      lastPassword,
      isValid,
      numTel,
      role,
    } = req.body;

    // Check if the email already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists. Please choose another email.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Handle image upload
    const imageData = req.body.imageRes || 'https://th.bing.com/th/id/OIP.iAhcp6m_91O-ClK79h8EQQHaFj?w=221&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7';
    const cloudinaryResponse = await uploadImage(imageData);

    // Assuming that the image URL is in the secure_url property of the Cloudinary response
    const imageUrl = cloudinaryResponse.secure_url;

    // Create user with Cloudinary image URL
    const newUser = await User.create({
      email,
      password: hashedPassword,
      nom,
      prenom,
      dateNaissance,
      adress,
      cin,
      userName,
      lastPassword,
      isValid,
      numTel,
      imageRes: imageUrl,
      role,

    });

    // Send welcome email
    const mailOptions = {
      from: 'your-email@gmail.com',
      to: newUser.email,
      subject: 'Welcome to your application',
      text: 'Thank you for registering on our application. Welcome!',
      html: `
      <!-- Your HTML email content -->
    `,
    };

    transporter.sendMail(mailOptions, (emailError, info) => {
      if (emailError) {
        console.error(emailError);
      } else {
        console.log('Welcome email sent: ' + info.response);
      }
    });

    res.status(200).json(newUser);
  } catch (error) {
    if (error.name === 'ValidationError') {
      console.error('Validation Errors:', error.errors);
      res.status(400).json({ errors: error.errors });
    } else {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}
export function getUserById(req, res) {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        res.status(404).json({ message: 'Utilisateur introuvable' });
      } else {
        res.status(200).json(user);
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
}
export async function updateUserById(req, res) {
  // Utilisez les middlewares d'authentification et d'autorisation
  // avant d'effectuer les vérifications et les mises à jour

  if (!validationResult(req).isEmpty()) {
    return res.status(400).json({ errors: validationResult(req).array() });
  }

  console.log(req.body);

  try {
    const updatedUserData = {
      email: req.body.email,
      nom: req.body.nom,
      prenom: req.body.prenom,
      adress: req.body.adress,
      cin: req.body.cin,
      userName: req.body.userName,
      imageRes: req.body.imageRes,
    };

    // ...

    const updatedUser = await User.findByIdAndUpdate(req.body.email, updatedUserData, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: 'Utilisateur introuvable' });
    }

    res.status(200).json({ data: updatedUser, message: 'User updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export function deleteUserById(req, res) {
  authorizeAdmin(req, res, () => {
    User.findOneAndDelete({ _id: req.params.id })
      .then((user) => {
        if (!user) {
          res.status(404).json({ message: 'Utilisateur introuvable' });
        } else {
          res.status(200).json({ message: 'Utilisateur supprimé avec succès' });
        }
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  });
}
// Import necessary modules and middleware

// ...


export function updateScoreById(req, res) {



  // Check if the request body contains the "score" attribute
  if (!req.body.score) {
    console.log(req.body.score)
    return res.status(400).json({ message: 'Bad Request - Score is required' });

  }

  if (!req.body.id) {
    console.log(req.body.id)

    return res.status(400).json({ message: 'Bad Request - id is required' });
  }

  const updatedUserData = {
    score: req.body.score,
  };

  User.findByIdAndUpdate(req.body.id, updatedUserData, { new: true })
    .then((updatedUser) => {
      if (!updatedUser) {
        res.status(404).json({ message: 'Utilisateur introuvable' });
        console.log("ccccc")
      } else {
        res.status(200).json(updatedUser);
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
}

export async function resetPassword(req, res, next) {
  console.log(req.body);

  const token = req.body.email;
  try {
    const decoded = jwt.verify(token, 'your-secret-key'); // Replace 'your-secret-key' with your actual secret key
    req.user = decoded.user;

    // Hacher le mot de passe avec le sel
    const hash = await bcrypt.hash(req.body.password, 10);

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { password: hash },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({ message: 'Password changed!', user });
  } catch (error) {
    console.error('Error resetting password:', error);

    // Check the type of error thrown by jwt.verify
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token has expired' });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Handle other types of errors as needed
    res.status(500).json({ error: 'Internal Server Error' });
  }

}
// Export the sendResetCodeByTel function
export async function sendResetCodeByTel(req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email } = req.body;
  console.log(email)
  try {
    const user = await User.findOne({ email });
    console.log(user)
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const resetCode = generateResetCode();

    // Send SMS using Twilio
    client.messages.create({
      body: `Your password reset code is: ${resetCode}`,
      from: '+18638247637',
      to: user.numTel, // Assuming you have a phone field in your user model
    });

    // Save the reset code in the user document
    user.resetCode = resetCode;
    user.save();

    // Create and sign a JWT token
    const token = jwt.sign({ user: { id: user._id, role: user.role, resetCode } }, 'your-secret-key', { expiresIn: '1h' });

    // Return the user along with the reset code
    res.json({ user, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
function generateResetCode() {
  return Math.floor(1000 + Math.random() * 9000);
}




export async function sendResetCode(req, res) {
  const errors = validationResult(req);
  console.log(req.body)

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email } = req.body;

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

      user.token = jwt.sign({ user: { id: user._id, role: user.role, resetCode: user.resetCode } }, 'your-secret-key', { expiresIn: '1h' });

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