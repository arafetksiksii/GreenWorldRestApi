import express from "express";
import { body, query } from "express-validator";

import multer from "../middlewares/multer-config.js";
import Produit from "../models/produit.js";

import { getAll, addOnce, getOnce, putOnce, getRandomProduct } from "../controllers/produit.js";

const router = express.Router();
router.get("/all", async (req, res) => {
  try {
    const allProducts = await Produit.find();

    if (allProducts.length === 0) {
      return res.status(404).json({ message: 'No products found in the database.' });
    }

    res.status(200).json(allProducts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.get("/organic", async (req, res) => {
  try {
    const organicProducts = await Produit.find({ category: "organic" });

    if (organicProducts.length === 0) {
      return res.status(404).json({ message: 'No organic products found in the database.' });
    }

    res.status(200).json(organicProducts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.get("/natural", async (req, res) => {
  try {
    const organicProducts = await Produit.find({ category: "natural" });

    if (organicProducts.length === 0) {
      return res.status(404).json({ message: 'No organic products found in the database.' });
    }

    res.status(200).json(organicProducts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.get("/reusable", async (req, res) => {
  try {
    const organicProducts = await Produit.find({ category: "reusable" });

    if (organicProducts.length === 0) {
      return res.status(404).json({ message: 'No organic products found in the database.' });
    }

    res.status(200).json(organicProducts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.get("/handcrafted", async (req, res) => {
  try {
    const organicProducts = await Produit.find({ category: "handcrafted" });

    if (organicProducts.length === 0) {
      return res.status(404).json({ message: 'No organic products found in the database.' });
    }

    res.status(200).json(organicProducts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
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
    body("image2"),
    body("image3"),
    body("category"),

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
    body("category"),
    body("image2"),
    body("image3"),
    putOnce
  );

// New route to retrieve product details by ID as a query parameter



export default router;
