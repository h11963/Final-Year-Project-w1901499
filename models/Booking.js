const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
  },
  ownerId: { type: String },

  studio: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Studio', 
  },
  userName: { type: String, required: true },
  phone: { type: String, required: true },
  studioName: { type: String },
  date: { type: String, required: true },
  status: { type: String, default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);