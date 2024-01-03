import { validationResult } from "express-validator";

import PointDeCollecte from "../models/pointCollect.js";

export function getAll(req, res) {
    PointDeCollecte.find({})
    .then((docs) => {
      let list = [];
      for (let i = 0; i < docs.length; i++) {
        list.push({
          id: docs[i]._id,
          nom: docs[i].nom,
          latitude: docs[i].latitude,
          longitude: docs[i].longitude,
          capacite: docs[i].capacite,
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
    return res.status(400).json({ errors: validationResult(req).array() });
} else {

  PointDeCollecte.create({
        nom: req.body.nom,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        // capacite: req.body.capacite,

    })
      .then((newPoint) => {
        res.status(200).json({
            nom: newPoint.nom,
            latitude: newPoint.latitude,
            longitude: newPoint.longitude,
            capacite: newPoint.capacite,

        });
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  }
}


export function getOnce(req, res) {
  PointDeCollecte.findById(req.params.id)
  .then((doc) => {
    res.status(200).json(doc);
  })
  .catch((err) => {
    res.status(500).json({ error: err });
  });
}
export function deleteOnce(req, res) {
  const { id } = req.params;

  PointDeCollecte.findOneAndDelete({ _id: id })
    .then((doc) => {
      if (doc) {
        res.status(200).json({ message: "Document deleted successfully", deletedDoc: doc });
      } else {
        res.status(404).json({ message: "Document not found" });
      }
    })
    .catch((err) => {
      console.error("Error deleting document:", err);
      res.status(500).json({ error: "Internal server error" });
    });
}
export function putOnce(req, res) {
  let newPoint = {};
  if(req.file == undefined) {
    newPoint = {
        nom: req.body.nom,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        capacite: req.body.capacite,

    }
  }
  else {
    newPoint = {
        nom: req.body.nom,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        capacite: req.body.capacite,
    }
  }
  PointDeCollecte.findByIdAndUpdate(req.params.id, newDechets)
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

