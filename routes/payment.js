const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Single Item Purchase 
router.post('/create-checkout-session', async (req, res) => {

  const { name, price, productId, audioPreview } = req.body; 

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
          price_data: {
            currency: 'gbp',
            product_data: { name: name },
            unit_amount: Math.round(price * 100), 
          },
          quantity: 1,
      }],
      mode: 'payment',
     
      success_url: `http://localhost:3000/dashboard?payment=success&id=${productId}&name=${encodeURIComponent(name)}&audio=${encodeURIComponent(audioPreview)}`,
      cancel_url: `http://localhost:3000/marketplace`,
    });

    res.json({ url: session.url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.post('/create-basket-checkout', async (req, res) => {
  const { basketItems } = req.body;

  try {
    const line_items = basketItems.map(item => ({
      price_data: {
        currency: 'gbp',
        product_data: { name: item.name },
        unit_amount: Math.round(Number(item.price) * 100),
      },
      quantity: 1,
    }));

    const allIds = basketItems.map(item => item._id).join(',');
    const allNames = basketItems.map(item => item.name).join(',');
    
  
    const allAudios = basketItems.map(item => item.audioPreview || '').join(',');

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: line_items,
      mode: 'payment',
     
      success_url: `http://localhost:3000/dashboard?payment=success&id=${allIds}&name=${encodeURIComponent(allNames)}&audio=${encodeURIComponent(allAudios)}`,
      cancel_url: `http://localhost:3000/basket`,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("Basket Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;