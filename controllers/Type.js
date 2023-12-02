import { validationResult } from "express-validator";

import Type from "../models/Type.js";

export function getAll(req, res) {
  
  Type.find({})
    .then((docs) => {
      let list = [];
      for (let i = 0; i < docs.length; i++) {
        list.push({
          id: docs[i]._id,
          titre: docs[i].titre,
          image_type: docs[i].image_type,
        });
      }
      res.status(200).json(list);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
}

export function addOnce(req, res) {
  console.log(req.body)
  if (!validationResult(req).isEmpty()) {
    res.status(400).json({ errors: validationResult(req).array() });
  } else {
    Type.create({
      titre: req.body.titre,
      image_type: `http://10.0.2.2:9090/img/${req.file.filename}`

    })
      .then((newType) => {
        res.status(200).json({
          titre: newType.titre,

          image_type: newType.image_type,
        });
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  }
}

export function getOnce(req, res) {
  Type.findById(req.params.id)
    .then((doc) => {
      res.status(200).json(doc);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
}

export function putOnce(req, res) {
  let newType = {};
  if(req.file == undefined) {
    newType = {
      titre: req.body.titre,

    }
  }
  else {
    newType = {
      titre: req.body.titre,
      image_type: `${req.protocol}://${req.get("host")}/img/${req.file.filename}`
    }
  }
  Type.findByIdAndUpdate(req.params.id, newType)
    .then((doc1) => {
      Type.findById(req.params.id)
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


