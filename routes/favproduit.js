import express from "express";
import Favproduit from "../models/favproduit.js";
import Produit from"../models/produit.js";

const router = express.Router();

// Create a new "Favproduit"
router.post('/', async (req, res) => {
  const userId = "6550afa009316488cc193ed1"
  try {
    const { selectedProducts } = req.body;

    // Calculate the total price based on the products in selectedProducts


    const newFavproduit = new Favproduit({ selectedProducts, userId });
    const savedFavproduit = await newFavproduit.save();
    res.status(201).json(savedFavproduit);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


// add products to a Favproduit 

// Add products to a "Favproduit"
// Add products to a "Favproduit"
router.post('/add-products', async (req, res) => {
  try {
    const userId = "6550afa009316488cc193ed1";
    const produitId = req.query.produitId;

    // Fetch the existing Favproduit for the user
    let favproduit = await Favproduit.findOne({ userId });

    // If the user doesn't have an existing Favproduit, create a new one
    if (!favproduit) {
      const newFavproduit = new Favproduit({ userId, selectedProducts: [] });
      favproduit = await newFavproduit.save();
    }

    // Check if the product is already in the selectedProducts array
    const existingProductIndex = favproduit.selectedProducts.findIndex(
      (selectedProduct) => selectedProduct.produit.toString() === produitId
    );

    if (existingProductIndex !== -1) {
      // If the product is already in the array, increase the quantity by 1
      favproduit.selectedProducts[existingProductIndex].quantity += 1;
    } else {
      // If the product is not in the array, fetch the product by productId
      const produit = await Produit.findById(produitId);

      if (!produit) {
        return res.status(404).json({ error: 'Product not found' });
      }

      // Add the product to the selectedProducts array in the Favproduit
      favproduit.selectedProducts.push({
        produit,
        quantity: 1,
        title: produit.title,
        price: produit.price,
        image: produit.image,
      });
    }





    const updatedFavproduit = await favproduit.save();
    res.json(updatedFavproduit);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});




router.delete('/delete-product', async (req, res) => {
  try {
    const userId = "6550afa009316488cc193ed1";
    const produitId = req.query.produitId;

    // Fetch the existing command for the user
    let favproduit = await Favproduit.findOne({ userId });

    // If the user doesn't have an existing command, return an error
    if (!favproduit) {
      return res.status(404).json({ error: 'Command not found' });
    }

    // Find the index of the product in the selectedProducts array
    const productIndex = favproduit.selectedProducts.findIndex(
      (selectedProduct) => selectedProduct.produit.toString() === produitId
    );

    // If the product is not found, return an error
    if (productIndex === -1) {
      return res.status(404).json({ error: 'Product not found in the command' });
    }

    // Get the price of the product being removed
    const removedProductPrice = favproduit.selectedProducts[productIndex].price;

    // Remove the product from the selectedProducts array
    favproduit.selectedProducts.splice(productIndex, 1);





    // Save the updated command
    const updatedFavproduit = await favproduit.save();

    res.json(updatedFavproduit);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Other routes...


// Retrieve a "favproduit" by its ID
router.get('/favorites', async (req, res) => {
  try {
    const userId = "6550afa009316488cc193ed1";

    const favproduit = await Favproduit.findOne({ userId });

    if (!favproduit) {
      return res.status(404).json({ error: 'favproduit not found' });
    }

    res.json(favproduit);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



export default router;
