import { validationResult } from 'express-validator';
import User from '../models/user.js';
import { authenticateUser, authorizeAdmin } from '../middlewares/authMiddleware.js';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import cloudinary from 'cloudinary';

import upload from '../middlewares/mm.js'; // Update this import based on your file structure

//configuration nodemailer 
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'aymen.zouaoui@esprit.tn',
    pass: '223AMT0874',
  },
});
// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: 'dznvwntjn',
  api_key: '972319243848173',
  api_secret: 'xp2G8BXbjvjec0dbFIaQbUJ3Mj8',
  secure: true,
});

//recover all users
export function getAllUsers(req, res) {
 
   
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
        };
      });
      res.status(200).json(userList);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });

}
// add user


export async function addUser(req, res) {
  const errors = validationResult(req);

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
    role,
  } = req.body;

  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user without Cloudinary image URL
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
      role,
    });

    // Send welcome email
    const mailOptions = {
      from: 'your-email@gmail.com',
      to: newUser.email,
      subject: 'Welcome to your application',
      text: 'Thank you for registering on our application. Welcome!',
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
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
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
export function updateUserById(req, res) {
  if (!validationResult(req).isEmpty()) {
    return res.status(400).json({ errors: validationResult(req).array() });
  }

  // Use the authentication middleware before the authorization middleware
  authenticateUser(req, res, () => {
    authorizeAdmin(req, res, () => {
      const updatedUserData = {
        email: req.body.email,
        password: req.body.password,
        nom: req.body.nom,
        prenom: req.body.prenom,
        dateNaissance: req.body.dateNaissance,
        adress: req.body.adress,
        cin: req.body.cin,
        userName: req.body.userName,
        lastPassword: req.body.lastPassword,
        isValid: req.body.isValid,
        imageRes: req.body.imageRes, 
       // imageRes:`http://127.0.0.1/img/${req.file.filename}`
        role: req.body.role,
      };

      User.findByIdAndUpdate(req.params.id, updatedUserData, { new: true })
        .then((updatedUser) => {
          if (!updatedUser) {
            res.status(404).json({ message: 'Utilisateur introuvable' });
          } else {
            res.status(200).json({ data: updatedUser, message: 'User updated successfully' });

          }
        })
        .catch((err) => {
          res.status(500).json({ error: err });
        });
    });
  });
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



export function updateProfilById(req, res) {
  if (!validationResult(req).isEmpty()) {
    return res.status(400).json({ errors: validationResult(req).array() });
  }

  // Use the authentication middleware before the authorization middleware
  authenticateUser(req, res, () => {
    // Check if the authenticated user is the same as the user being updated
    if (req.user.id !== req.params.id) {
      return res.status(403).json({ message: 'Forbidden - You are not allowed to modify this user' });
    }

    const updatedUserData = {
      email: req.body.email,
      password: req.body.password,
      nom: req.body.nom,
      prenom: req.body.prenom,
      dateNaissance: req.body.dateNaissance,
      adress: req.body.adress,
      cin: req.body.cin,
      userName: req.body.userName,
      lastPassword: req.body.lastPassword,
      isValid: req.body.isValid,
      imageRes: req.body.imageRes, 
      role: req.body.role,
    };

    User.findByIdAndUpdate(req.params.id, updatedUserData, { new: true })
      .then((updatedUser) => {
        if (!updatedUser) {
          res.status(404).json({ message: 'Utilisateur introuvable' });
        } else {
          res.status(200).json(updatedUser);
        }
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  });
}


