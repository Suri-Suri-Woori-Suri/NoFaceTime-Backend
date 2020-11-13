const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  nickname: {
    type: String,
    required: true,
    trim: true
  },
  groups: [Schema.Types.ObjectId],
  rooms: [Schema.Types.ObjectId]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
