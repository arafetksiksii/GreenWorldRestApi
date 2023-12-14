import express from 'express';
import Stripe from 'stripe';

const stripe = new Stripe('sk_test_51ODOR4KuYIHrh7zw51qwhgS8oDwJcwWbq4Sqe1BA7oFNhf51Es6AuXUPO3VZLDvl2PYzkGQfybGWWjfGKwn6VdxP00A27LizGQ'); // Replace with your actual Stripe secret key

const router = express.Router();

// Generate ephemeral key for the customer
router.post('/', async (req, res) => {
  try {
    const { customerId } = req.body;

    // Create or retrieve the customer
    const customer = await stripe.customers.create({
      id: customerId,
    });

    // Generate an ephemeral key for the customer
    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: customer.id },
      { apiVersion: 'latest' } // Adjust the API version as needed
    );

    res.json({ ephemeralKey: ephemeralKey.secret });
  } catch (error) {
    console.error('Error generating ephemeral key:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
