import { validationResult } from "express-validator";

import Produit from "../models/produit.js";

export function getAll(req, res) {
  Produit.find({})
    .then((docs) => {
      let list = [];
      for (let i = 0; i < docs.length; i++) {
        list.push({
          id: docs[i]._id,
          title: docs[i].title,
          description: docs[i].description,
          price: docs[i].price,
          quantity: docs[i].quantity,
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
    Produit.create({
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      quantity: req.body.quantity,
      image: `http://192.168.1.166:9090/img/${req.file.filename}`,
    })
      .then((newProduit) => {
        res.status(200).json({
          title: newProduit.title,
          description: newProduit.description,
          price: newProduit.price,
          quantity: newProduit.quantity,
          image: newProduit.image,
        });
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  }
}

export function getOnce(req, res) {
  Produit.findById(req.params.id)
    .then((doc) => {
      res.status(200).json(doc);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
}

export function putOnce(req, res) {
  let newProduit = {};
  if(req.file == undefined) {
    newProduit = {
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      quantity: req.body.quantity
    }
  }
  else {
    newProduit = {
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      quantity: req.body.quantity,
      image: `${req.protocol}://${req.get("host")}/img/${req.file.filename}`
    }
  }
  Produit.findByIdAndUpdate(req.params.id, newProduit)
    .then((doc1) => {
      Produit.findById(req.params.id)
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
export function getRandomProduct(req, res) {
  Produit.aggregate([{ $sample: { size: 1 } }])
    .exec((err, randomProduct) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: err.message });
      }

      if (randomProduct.length === 0) {
        return res.status(404).json({ error: "No random product found" });
      }

      res.status(200).json(randomProduct[0]);
    });
}


