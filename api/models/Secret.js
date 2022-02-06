const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Secret = new Schema({
  hash: {
    type: String,
    required: true,
    index: { unique: true }
  },
  secretText: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true
  },
  remainingViews: {
    type: Number,
    required: true
  }
})

module.exports = mongoose.model('Secret', Secret)
