const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, default: 0 }, 
  genre: { type: String, required: false },
  image: { type: String, default: 'https://placehold.co/400?text=Listing' },
  audioPreview: {
  type: String,
  required: function() { return this.category === 'beat'; }},
  description: { type: String, required: true },
  
  type: { 
    type: String, 
    enum: ['Beat', 'Vocals', 'Demo', 'Collaboration', 'Studio'], 
    default: 'Beat' 
  },
  artist: { type: String }
});

module.exports = mongoose.model('Product', productSchema);