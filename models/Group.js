const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  members: [Schema.Types.ObjectId]
}, { timestamps: true });

module.exports = mongoose.model('Group', groupSchema);
