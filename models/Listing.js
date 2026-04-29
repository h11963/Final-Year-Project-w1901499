const mongoose = require('mongoose');

const ListingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, enum: ['Beat', 'Vocal', 'Collaboration'], default: 'Collaboration' },
  price: { type: String, default: 'Collaboration' },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Listing', ListingSchema);