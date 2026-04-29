const express = require('express');
const router = express.Router();
const Product = require('../models/Product');


router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Beat not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: "Invalid ID format" });
  }
});


router.post('/', (req, res) => {
  const upload = req.app.get('upload');

  if (!upload) {
    return res.status(500).json({ error: "Upload tool not configured." });
  }

  const cpUpload = upload.fields([
    { name: 'audioFile', maxCount: 1 },
    { name: 'imageFile', maxCount: 1 }
  ]);

  cpUpload(req, res, async (err) => {
    if (err) return res.status(400).json({ error: "Upload Error: " + err.message });

    const { name, description, price, genre, artist, type, category } = req.body;


    if (category !== 'studio' && (!req.files || !req.files['audioFile'])) {
      return res.status(400).json({ error: "Audio file is required." });
    }

    try {
      const defaultImages = [
        "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=600",
        "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=600",
        "https://images.unsplash.com/photo-1559732277-7453b141e3a1?q=80&w=600"
      ];
      const randomDefault = defaultImages[Math.floor(Math.random() * defaultImages.length)];

  
      const imagePath = (req.files && req.files['imageFile'] && req.files['imageFile'][0]) 
        ? `/images/${req.files['imageFile'][0].filename}` 
        : randomDefault;

    
      const audioPath = (category === 'studio')
        ? "studio_placeholder"
        : (req.files && req.files['audioFile'] && req.files['audioFile'][0])
          ? `/audio/${req.files['audioFile'][0].filename}`
          : "no_audio_provided";

      const newProduct = new Product({
        name: name || "Untitled Listing",
        description: description || "",
        price: Number(price) || 0,
        genre: genre || "General",
        artist: artist || "Anonymous",
        type: type || "Listing",
        category: category || "beat",
        audioPreview: audioPath,
        image: imagePath
      });

      const savedProduct = await newProduct.save();
      res.status(201).json(savedProduct);
      
    } catch (dbErr) {
     
      res.status(400).json({ error: dbErr.message });
    }
  });
});


router.delete('/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;