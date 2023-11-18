import { validationResult } from 'express-validator';
import User from '../models/user.js';
import { authenticateUser, authorizeAdmin } from '../middlewares/authMiddleware.js';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import {uploadImage  } from '../middlewares/mm.js';


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'aymen.zouaoui@esprit.tn',
    pass: '223AMT0874',
  },
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
    const imageData = req.body.imageRes;
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
export function updateUserById(req, res) {
  if (!validationResult(req).isEmpty()) {
    return res.status(400).json({ errors: validationResult(req).array() });
  }
 
      try {
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
          role: req.body.role,
        };

        // Handle image upload
        if (req.body.imageRes) {
          const imageData = req.body.imageRes;
          const imageRes =  uploadImage(imageData);
          updatedUserData.imageRes = imageRes;
        }

        const updatedUser =  User.findByIdAndUpdate(req.params.id, updatedUserData, { new: true });

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
    return res.status(400).json({ message: 'Bad Request - Score is required' });
  }

  const updatedUserData = {
    score: req.body.score,
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
}


