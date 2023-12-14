import Commande from "../models/commande.js";
import Produit from "../models/produit.js";

// Create a new "commande"
// Create a new "commande"
const createCommande = async (req, res) => {
  try {
    console.log('Received request body:', req.body); // Log the entire request body
    const { userId, selectedProducts } = req.body;


    const newCommande = new Commande({userId, selectedProducts, totalPrice });
    const savedCommande = await newCommande.save();
    res.status(201).json(savedCommande);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Add products to a "commande"
// Add products to a "commande"
// Add products to a "commande"
const addProductsToCommande = async (req, res) => {
  try {
    const commande = await Commande.findById(req.params.id);

    if (!commande) {
      return res.status(404).json({ error: 'Commande not found' });
    }

    const { selectedProducts } = req.body;
    commande.selectedProducts.push(...selectedProducts);



  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};




// Retrieve a "commande" by its ID
const getCommandeById = async (req, res) => {
  try {
    const commande = await Commande.findById(req.params.id);

    if (!commande) {
      return res.status(404).json({ error: 'Commande not found' });
    }

    res.json(commande);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
export async function deleteCommandeById(commandeId) {
  try {
    await Commande.findByIdAndDelete(commandeId);
  } catch (error) {
    console.error('Error deleting command:', error);
    throw new Error('Error deleting command');
  }
}
export default {
  createCommande,
  addProductsToCommande,
  deleteCommandeById,
  getCommandeById,
};
