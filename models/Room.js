const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  host: {
    type: Schema.Types.ObjectId,
    required: true,
    trim: true
  },
  link: {
    type: String,
    unique: true,
    required: true,
    trim: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Room', roomSchema);
