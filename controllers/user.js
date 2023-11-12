import { validationResult } from 'express-validator';
import User from '../models/user.js';
import { authenticateUser, authorizeAdmin } from '../middlewares/authMiddleware.js';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';


//configuration nodemailer 
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'aymen.zouaoui@esprit.tn',
    pass: '223AMT0874',
  },
});


//recover all users
export function getAllUsers(req, res) {
  authenticateUser(req, res, () => {
    authorizeAdmin(req, res, () => {
   
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
  });
});
}
// add user
export function addUser(req, res) {
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
    imageRes,
    role,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hashedPassword) => {
      return User.create({
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
        imageRes,
        role,
      });
    })
    .then((newUser) => {

      // Read the HTML content from a file
      // Envoi de l'e-mail de bienvenue
      const mailOptions = {
        from: 'votre-email@gmail.com',
        to: newUser.email,
        subject: 'Bienvenue sur votre application',
        text: 'Merci de vous être inscrit sur notre application. Bienvenue!',
       
    
  
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(error);
          // Si l'envoi de l'e-mail échoue, cela ne bloque pas la réponse au client
        } else {
          console.log('E-mail de bienvenue envoyé : ' + info.response);
        }
      });

      res.status(200).json(newUser);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: 'Internal Server Error' });
    });
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
            res.status(200).json(updatedUser);
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


