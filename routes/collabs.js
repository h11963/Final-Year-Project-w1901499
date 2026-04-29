const express = require('express');
const router = express.Router();
const Collab = require('../models/Collab');


router.post('/', async (req, res) => {
  try {
    const newCollab = new Collab({ 
      ...req.body, 
      status: 'Pending' 
    });
    const savedCollab = await newCollab.save();
    res.status(201).json(savedCollab);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


router.get('/inbox/:userName', async (req, res) => {
  try {
    const requests = await Collab.find({ receiverName: req.params.userName });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get('/outbox/:userName', async (req, res) => {
  try {
    
    const requests = await Collab.find({ 
      senderName: { $regex: new RegExp("^" + req.params.userName + "$", "i") } 
    });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.put('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await Collab.findByIdAndUpdate(
      req.params.id, 
      { status: status }, 
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;