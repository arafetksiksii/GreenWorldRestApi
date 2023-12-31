import express from "express";
import Commande from "../models/commande.js";
import Produit from"../models/produit.js";
import stripe from "stripe";
import bodyParser from "body-parser";
import nodemailer from 'nodemailer';
import { deleteCommandeById } from '../controllers/commande.js';
import { authenticateUser } from "../middlewares/authMiddleware.js";
import {
  getAllUsers,
  addUser,
  getUserById,
  updateUserById,
  deleteUserById,
} from "../controllers/user.js";


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'arafetksiksi7@gmail.com', // replace with your email
    pass: 'klsa cxrc jgda utiv', // replace with your email password
  },
});
const router = express.Router();
router.use(bodyParser.json()); //
const stripeSecretKey = 'sk_test_51ODOR4KuYIHrh7zw51qwhgS8oDwJcwWbq4Sqe1BA7oFNhf51Es6AuXUPO3VZLDvl2PYzkGQfybGWWjfGKwn6VdxP00A27LizGQ';
const stripeClient = stripe(stripeSecretKey);
if (!stripeClient) {
  console.error('Error initializing Stripe client');
}
// Create a new "commande"
// Create a new "commande"
router.post('/', async (req, res) => {
  const userId = "655f7a41e7c5d11f0bd76ea0";
  try {
    const { selectedProducts } = req.body;

    // Calculate the total price based on the products in selectedProducts
    const totalPrice = 10;

    const newCommande = new Commande({ selectedProducts, totalPrice, userId });
    const savedCommande = await newCommande.save();
    res.status(201).json(savedCommande);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/delete-product', async (req, res) => {
  try {
    const userId = "655f7a41e7c5d11f0bd76ea0";
    const produitId = req.query.produitId;

    // Fetch the existing command for the user
    let commande = await Commande.findOne({ userId });

    // If the user doesn't have an existing command, return an error
    if (!commande) {
      return res.status(404).json({ error: 'Command not found' });
    }

    // Find the index of the product in the selectedProducts array
    const productIndex = commande.selectedProducts.findIndex(
      (selectedProduct) => selectedProduct.produit && selectedProduct.produit.toString() === produitId
      );
    // If the product is not found, return an error
    if (productIndex === -1) {
      return res.status(404).json({ error: 'Product not found in the command' });
    }

    // Get the price of the product being removed
    const removedProductPrice = commande.selectedProducts[productIndex].price;

    // Remove the product from the selectedProducts array
    commande.selectedProducts.splice(productIndex, 1);

    // Recalculate the total price
    const newTotalPrice = commande.selectedProducts.reduce((total, product) => {
      return total + product.price * product.quantity;
    }, 0);

    // Update the total price in the command
    commande.totalPrice = newTotalPrice;

    // Save the updated command
    const updatedCommande = await commande.save();

    res.json(updatedCommande);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
// add products to a commande

// Add products to a "commande"
// Add products to a "commande"
// ... (existing code)

// Add products to a "commande"
router.post('/add-products', async (req, res) => {
  try {
    const userId = "655f7a41e7c5d11f0bd76ea0";
    const produitId = req.query.produitId;

    // Fetch the existing commande for the user
    let commande = await Commande.findOne({ userId });

    // If the user doesn't have an existing commande, create a new one
    if (!commande) {
      const newCommande = new Commande({ userId, selectedProducts: [], totalPrice: 0 });
      commande = await newCommande.save();
    }

    // Check if the product is already in the selectedProducts array
    const existingProductIndex = commande.selectedProducts.findIndex(
      (selectedProduct) => selectedProduct.produit && selectedProduct.produit.toString() === produitId
    );

    if (existingProductIndex !== -1) {
      // If the product is already in the array, increase the quantity by 1
      commande.selectedProducts[existingProductIndex].quantity += 1;
    } else {
      // If the product is not in the array, fetch the product by productId
      const produit = await Produit.findById(produitId);

      if (!produit) {
        return res.status(404).json({ error: 'Product not found' });
      }

      // Add the product to the selectedProducts array in the commande
      commande.selectedProducts.push({
        produit,
        quantity: 1,
        title: produit.title,
        price: produit.price,
        image: produit.image,
      });
    }

    // Recalculate the total price based on the updated selectedProducts
    const totalPrice = commande.selectedProducts.reduce((acc, product) => {
      return acc + product.price * product.quantity;
    }, 0);

    // Update the totalPrice property
    commande.totalPrice = totalPrice;

    const updatedCommande = await commande.save();

    // Send email with order details
    const mailOptions = {
      from: 'arafetksiksi7@gmail.com',
      to: 'arafet.ksiksi@esprit.tn',
      subject: 'New Order',
      text: formatOrderDetails(updatedCommande),
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });

    res.json(updatedCommande);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Helper function to format order details
function formatOrderDetails(commande) {
  return `New order received!\n\nOrder Details:\n\n${formatCartDetails(commande.selectedProducts)}\nTotal Price: ${commande.totalPrice} TND`;
}

// ... (existing code)







// Other routes...


// Retrieve a "commande" by its ID
router.get('/cart', async (req, res) => {
  try {
    const userId = "655f7a41e7c5d11f0bd76ea0";

    const commande = await Commande.findOne({ userId });

    if (!commande) {
      return res.status(404).json({ error: 'Commande not found' });
    }

    res.json(commande);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
router.post('/create-payment-intent', async (req, res) => {
  try {
    const userId = "655f7a41e7c5d11f0bd76ea0";

    // Retrieve the existing command for the user
    const commande = await Commande.findOne({ userId });

    if (!commande) {
      return res.status(404).json({ error: 'Commande not found' });
    }

    // Calculate the total price based on the products in selectedProducts
    const totalPrice = commande.selectedProducts.reduce((acc, product) => {
      return acc + product.price * product.quantity;
    }, 0);

    // Create a PaymentIntent
    const paymentIntent = await stripeClient.paymentIntents.create({
      amount: totalPrice * 100, // Amount in cents
      currency: 'eur',
      payment_method_types: ['card'],
    });

    // Send email with cart details
   
    const mailOptions = {
      from: 'arafetksiksi7@gmail.com', // replace with your email
      to: 'arafet.ksiksi@esprit.tn', // replace with the user's email
      subject: 'Payment Receipt',
      text: `Thank you for your purchase!\n\nCart Details:\n\n${formatCartDetails(commande.selectedProducts)}\nTotal Price: ${totalPrice} TND`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
         deleteCommandeById(commande._id);

        console.log('Email sent:', info.response);
       
      }
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error sending email:', error);

    res.status(500).json({ error: error.message });
  }
});

// Helper function to format cart details
function formatCartDetails(selectedProducts) {
  return selectedProducts.map((product) => {
    return `${product.title}: ${product.quantity} x ${product.price} TND`;
  }).join('\n');
}

router.get('/all-commandes', async (req, res) => {
  try {
    // Fetch all commandes from the database
    const allCommandes = await Commande.find();

    // Send the list of commandes in the response
    res.json(allCommandes);
  } catch (error) {
    // Handle any errors that occur during the retrieval process
    res.status(500).json({ error: error.message });
  }
});


router.post('/create-payment-intent2', async (req, res) => {
  try {
    const { amount, userEmail } = req.body;

    console.log('Received amount:', amount); // Log the amount

    if (!amount || isNaN(amount)) {
      return res.status(400).json({ error: 'Invalid or missing amount' });
    }

    // Create a PaymentIntent
    const paymentIntent = await stripeClient.paymentIntents.create({
      amount: amount * 100, // Use the amount directly without rounding
      currency: 'usd',
      payment_method_types: ['card'],
    });

    if (!paymentIntent || !paymentIntent.client_secret) {
      throw new Error('Invalid PaymentIntent response');
    }

    // Send email with payment details
    const mailOptions = {
      from: 'arafetksiksi7@gmail.com', // replace with your email
      to: 'arafet.ksiksi@esprit.tn', // replace with the user's email
      subject: 'Payment Receipt',
      text: `Thank you for your payment!\n\nPayment Details:\n\nAmount: ${amount} USD`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error creating PaymentIntent:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});









export default router;