const mongoose = require('mongoose');

const ipoSchema = new mongoose.Schema({
  characterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Character', required: true },
  price: { type: Number, required: true },
  totalShares: { type: Number, default: 20 },
  deadline: { type: Date, required: true },
  appliedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  allottedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('Ipo', ipoSchema, 'as_ipos');
