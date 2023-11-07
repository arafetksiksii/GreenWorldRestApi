import { validationResult } from "express-validator";
import User from "../models/user.js";

export async function getAll(req, res) {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err });
  }
}

export async function getOnce(req, res) {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err });
  }
}

export async function addOnce(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const user = new User({
    email: req.body.email,
    password: req.body.password,
    nom: req.body.nom,
    prenom: req.body.prenom,
    dateNaissance: req.body.dateNaissance,
    adress: req.body.adress,
    cin: req.body.cin,
    userName: req.body.userName,
  });

  try {
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: err });
  }
}

export async function putOnce(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  user.email = req.body.email;
  user.password = req.body.password;
  user.nom = req.body.nom;
  user.prenom = req.body.prenom;
  user.dateNaissance = req.body.dateNaissance;
  user.adress = req.body.adress;
  user.cin = req.body.cin;
  user.userName = req.body.userName;

  try {
    await user.save();
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err });
  }
}

export async function deleteOnce(req, res) {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  try {
    await user.remove();
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err });
  }
}
