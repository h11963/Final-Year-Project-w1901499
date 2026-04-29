const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');


router.post('/', async (req, res) => {
    console.log("Booking request received!", req.body);
  try {
    const newBooking = new Booking(req.body);
    const savedBooking = await newBooking.save();
    res.status(201).json(savedBooking);
  } catch (err) {
    console.error("Booking Save Error:", err);
    res.status(400).json({ message: err.message });
  }
});


router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find().populate('studio');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.put('/:id', async (req, res) => {
  try {
    const updatedBooking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedBooking);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Cancel a booking
router.delete('/:id', async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: "Booking deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;