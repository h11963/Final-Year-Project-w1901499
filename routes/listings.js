const express = require('express');
const router = express.Router();
const Listing = require('../models/Listing');


router.post('/', async (req, res) => {
  try {
    const { title, description, type, price, userId } = req.body;

    const newListing = new Listing({
      title,
      description,
      type,
      price,
      user: userId
    });

    const listing = await newListing.save();
    res.json(listing);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


router.get('/', async (req, res) => {
  try {
    const listings = await Listing.find().sort({ date: -1 });
    res.json(listings);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;