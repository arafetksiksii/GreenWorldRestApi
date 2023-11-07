import { validationResult } from "express-validator";

import Demande from "../models/demande.js";
import Dechets from "../models/dechets.js";

export function getAll(req, res) {
    Demande.find({})
    .then((docs) => {
      let list = [];
      for (let i = 0; i < docs.length; i++) {
        list.push({
          id: docs[i]._id,
          titre: docs[i].titre,
          date_demande: docs[i].date_demande,
          type_materiel: docs[i].type_materiel,
          adresse: docs[i].adresse,
          est_valide: docs[i].est_valide,
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
    Demande.create({
        titre: req.body.titre,
        date_demande: req.body.date_demande,
        type_materiel: req.body.type_materiel,
        adresse: req.body.adresse,
        est_valide: req.body.est_valide,
    })
      .then((newDemandes) => {
        res.status(200).json({
            titre: newDemandes.titre,
            date_demande: newDemandes.date_demande,
            type_materiel: newDemandes.type_materiel,
            adresse: newDemandes.adresse,
            est_valide: newDemandes.est_valide,

        });
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  }
}

export function getOnce(req, res) {
    Demande.findById(req.params.id)
    .then((doc) => {
      res.status(200).json(doc);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
}

export function putOnce(req, res) {
  let newDemandes = {};
  if(req.file == undefined) {
    newDemandes = {
        titre: req.body.titre,
        date_demande: req.body.date_demande,
        type_materiel: req.body.type_materiel,
        adresse: req.body.adresse,
        est_valide: req.body.est_valide,
    }
  }
  else {
    newDemandes = {
        titre: req.body.titre,
        date_demande: req.body.date_demande,
        type_materiel: req.body.type_materiel,
        adresse: req.body.adresse,
        est_valide: req.body.est_valide,
    }
  }
  Demande.findByIdAndUpdate(req.params.id, newDemandes)
    .then((doc1) => {
        Demande.findById(req.params.id)
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