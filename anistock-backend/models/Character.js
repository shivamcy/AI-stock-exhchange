const mongoose = require('mongoose');

const characterSchema = new mongoose.Schema({
  name: String,
  anime: String,
  price: Number, // In Berries
  availableShares: Number,
  trendScore: { type: Number, default: 0 },
  sentimentScore: Number,
  youtubeMentions: Number,
  priceHistory: [
    {
        price: Number,
        date: {
          type: Date,
          default: Date.now
        }
      }
  ]
});

module.exports = mongoose.model('Character', characterSchema, 'as_characters');
