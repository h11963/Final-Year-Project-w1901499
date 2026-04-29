const express = require('express');
const router = express.Router();
const Studio = require('../models/Studio');


router.get('/', async (req, res) => {
  try {
    const studios = await Studio.find();
    res.json(studios);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.get('/:id', async (req, res) => {
  try {
    const studio = await Studio.findById(req.params.id);
    if (!studio) {
      return res.status(404).json({ message: "Studio not found" });
    }
    res.json(studio);
  } catch (err) {

    res.status(500).json({ message: "Invalid ID format or Server Error" });
  }
});



router.post('/', async (req, res) => {
  try {

    const { name, pricePerHour, location, description, owner, hardware, software, amenities } = req.body;

    const newStudio = new Studio({
      name,
      pricePerHour,
      location,
      description,
      owner,
      hardware,  
      software,  
      amenities, 
      imageUrl: req.body.imageUrl || 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=600'
    });

    const saved = await newStudio.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Save Error:", err);
    res.status(400).json({ error: err.message });
  }
});


router.delete('/:id', async (req, res) => {
  try {
    const studio = await Studio.findById(req.params.id);
    if (!studio) return res.status(404).json({ message: "Studio not found" });



    await studio.deleteOne();
    res.json({ message: "Studio deleted successfully" });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;