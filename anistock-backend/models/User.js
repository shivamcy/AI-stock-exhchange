const mongoose = require('mongoose');

const holdingSchema = new mongoose.Schema({
  characterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Character' },
  quantity: Number,
  avgPrice: Number
});
const autoOrderSchema = new mongoose.Schema({
    characterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Character'
    },
    type: { type: String, enum: ['buy', 'sell'], required: true },
    quantity: Number,
    triggerPrice: Number,
    active: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
  });
  const notificationSchema = new mongoose.Schema({
    message: String,
    read: { type: Boolean, default: false },
    date: { type: Date, default: Date.now }
  });

const userSchema = new mongoose.Schema({
  username: String,
  email: { type: String, unique: true },
  passwordHash: String,
  wallet: { type: Number, default: 10000 },
  holdings: [holdingSchema],
  autoOrders: [autoOrderSchema],
  notifications: [notificationSchema],
  isAdmin: { type: Boolean, default: false },
  transactions: [
    {
      type: { type: String, enum: ['buy', 'sell'] },
      character: String,
      quantity: Number,
      price: Number,
      date: { type: Date, default: Date.now }
    }
  ]
});

module.exports = mongoose.model('User', userSchema, 'as_users');
