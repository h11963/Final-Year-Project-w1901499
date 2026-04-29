// backend/models/Demo.js
const mongoose = require('mongoose');
const DemoSchema = new mongoose.Schema({
  title: String,
  file: String,
  artist: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  description: String,
  type: { type: String, enum: ['demo','instrumental'] }
});
module.exports = mongoose.model('Demo', DemoSchema);