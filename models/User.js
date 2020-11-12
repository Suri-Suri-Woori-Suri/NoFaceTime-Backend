const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  username: {
    type: String,
    required: true,
    trim: true
  },
  groups: [Schema.Types.ObjectId],
  rooms: [Schema.Types.ObjectId]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
