import express from "express";
import { body, query } from "express-validator";

import multer from "../middlewares/multer-config.js";
import Produit from "../models/produit.js";

import { getAll, addOnce, getOnce, putOnce, getRandomProduct } from "../controllers/produit.js";

const router = express.Router();
router.get("/detail", [
  query("id").isMongoId().withMessage("Invalid product ID format"),
], async (req, res) => {


  const productId = req.query.id;

  try {
    const product = await Produit.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/random-product', async (req, res, next) => {
  try {
    const produits = await Produit.find();
    if (produits.length === 0) {
      return res.status(404).json({ message: 'No produits found in the database. Something must have gone wrong.' });
    } else {
      const random = Math.floor(Math.random() * produits.length);
      res.status(200).json(produits[random]);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router
  .route("/")
  .get(getAll)
  .post(
    multer("image", 5 * 1024 * 1024),
    body("title").isLength({ min: 5 }),
    body("description").isLength({ min: 5 }),
    body("price").isNumeric(),
    body("quantity").isNumeric(),
    addOnce
  );

router
  .route("/:id")
  .get(getOnce)
  .put(
    multer("image", 5 * 1024 * 1024),
    body("title").isLength({ min: 5 }),
    body("description").isLength({ min: 5 }),
    body("price").isNumeric(),
    body("quantity").isNumeric(),
    putOnce
  );

// New route to retrieve product details by ID as a query parameter



export default router;
