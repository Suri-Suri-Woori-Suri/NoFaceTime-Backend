const mongoose = require('mongoose');
const { Schema } = mongoose;

const groupSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  members: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }]
}, { timestamps: true });

module.exports = mongoose.model('Group', groupSchema);
