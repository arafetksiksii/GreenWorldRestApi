import { validationResult } from "express-validator";

import Dechets from "../models/dechets.js";

export function getAll(req, res) {
    Dechets.find({})
    .then((docs) => {
      let list = [];
      for (let i = 0; i < docs.length; i++) {
        list.push({
          id: docs[i]._id,
          Type_dechets: docs[i].Type_dechets,
          date_depot: docs[i].date_depot,
          nombre_capacite: docs[i].nombre_capacite,
          image: docs[i].image,
        });
      }
      res.status(200).json(list);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
}

export function addOnce(req, res) {
  if (!validationResult(req).isEmpty()) {
    res.status(400).json({ errors: validationResult(req).array() });
  } else {
    Dechets.create({
        Type_dechets: req.body.Type_dechets,
        date_depot: req.body.date_depot,
        nombre_capacite: req.body.nombre_capacite,
      image: `${req.protocol}://${req.get("host")}/img/${req.file.filename}`,
    })
      .then((newDechets) => {
        res.status(200).json({
            Type_dechets: newDechets.Type_dechets,
            date_depot: newDechets.date_depot,
            nombre_capacite: newDechets.nombre_capacite,
          image: newDechets.image,
        });
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  }
}

export function getOnce(req, res) {
    Dechets.findById(req.params.id)
    .then((doc) => {
      res.status(200).json(doc);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
}

export function putOnce(req, res) {
  let newDechets = {};
  if(req.file == undefined) {
    newDechets = {
        Type_dechets: req.body.Type_dechets,
        date_depot: req.body.date_depot,
        nombre_capacite: req.body.nombre_capacite,
    }
  }
  else {
    newDechets = {
        Type_dechets: req.body.Type_dechets,
        date_depot: req.body.date_depot,
        nombre_capacite: req.body.nombre_capacite,
      image: `${req.protocol}://${req.get("host")}/img/${req.file.filename}`
    }
  }
  Dechets.findByIdAndUpdate(req.params.id, newDechets)
    .then((doc1) => {
        Dechets.findById(req.params.id)
        .then((doc2) => {
          res.status(200).json(doc2);
        })
        .catch((err) => {
          res.status(500).json({ error: err });
        });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
}
