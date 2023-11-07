import { validationResult } from 'express-validator';
import User from '../models/user.js';

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

export function addUser(req, res) {
  if (!validationResult(req).isEmpty()) {
    res.status(400).json({ errors: validationResult(req).array() });
  } else {
    User.create({
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
    })
      .then((newUser) => {
        res.status(200).json(newUser);
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
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
    res.status(400).json({ errors: validationResult(req).array() });
  } else {
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
  }
}

export function deleteUserById(req, res) {
  User.findByIdAndRemove(req.params.id)
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
}
