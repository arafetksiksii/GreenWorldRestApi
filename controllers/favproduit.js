import Favproduit from "../models/favproduit.js";
import Produit from "../models/produit.js";


const createFavproduit = async (req, res) => {
  try {
    console.log('Received request body:', req.body); // Log the entire request body
    const { userId, selectedProducts } = req.body;


    const newFavproduit = new Favproduit({userId, selectedProducts });
    const savedFavproduit = await newFavproduit.save();
    res.status(201).json(savedFavproduit);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


// Add products to a "Favproduit"
const addProductsToFavproduit = async (req, res) => {
  try {
    const favproduit = await Favproduit.findById(req.params.id);

    if (!favproduit) {
      return res.status(404).json({ error: 'Favproduit not found' });
    }

    const { selectedProducts } = req.body;
    favproduit.selectedProducts.push(...selectedProducts);



  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};




// Retrieve a "Favproduit" by its ID
const getFavproduitById = async (req, res) => {
  try {
    const favproduit = await Favproduit.findById(req.params.id);

    if (!favproduit) {
      return res.status(404).json({ error: 'Favproduit not found' });
    }

    res.json(Favproduit);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export default {
  createFavproduit,
  addProductsToFavproduit,

  getFavproduitById,
};
