const mongoose = require('mongoose');

const StudioSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true }, 
  pricePerHour: { type: Number, required: true },
  description: { type: String },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  instruments: { type: String },
  availableSlots: [String], 
  hardware: { type: String }, 
  software: { type: String }, 
  amenities: { type: String },
  features: { type: String }, 
  imageUrl: { type: String } 
}, { timestamps: true });

module.exports = mongoose.model('Studio', StudioSchema);