const mongoose = require('mongoose');

const collabSchema = new mongoose.Schema({
  projectName: { type: String, required: true },
  senderName: { type: String, required: true },   
  receiverName: { type: String, required: true }, 
  message: { type: String },
  status: { 
    type: String, 
    enum: ['Pending', 'Accepted', 'Declined'], 
    default: 'Pending' 
  }
});

module.exports = mongoose.model('Collab', collabSchema);