const express = require('express');
const router = express.Router();
const Collab = require('../models/Collab'); 

// POST a new collab request
router.post('/', async (req, res) => {
  try {
    const newCollab = new Collab(req.body);
    const savedCollab = await await newCollab.save();
    res.status(201).json(savedCollab);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error saving collab" });
  }
});

// GET collabs for a user
router.get('/:username', async (req, res) => {
  try {
    const collabs = await Collab.find({ receiverName: req.params.username });
    res.json(collabs);
  } catch (err) {
    res.status(500).json({ message: "Error fetching collabs" });
  }
});

module.exports = router;