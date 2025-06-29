const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Character = require('../models/Character');
const auth = require('../middleware/authMiddleware'); // 👈 import auth

// BUY Character (protected)
router.post('/buy', auth, async (req, res) => {
  const { characterId, quantity } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    const character = await Character.findById(characterId);
    if (!user || !character) return res.status(404).json({ error: 'User or Character not found' });

    const totalCost = character.price * quantity;
    if (user.wallet < totalCost) return res.status(400).json({ error: 'Not enough Berries' });
    if (character.availableShares < quantity) return res.status(400).json({ error: 'Not enough shares' });

    // 🧾 Deduct wallet balance
    user.wallet -= totalCost;

    // 📈 Update holdings
    const holding = user.holdings.find(h => h.characterId.equals(character._id));
    if (holding) {
      const totalQty = holding.quantity + quantity;
      holding.avgPrice = ((holding.avgPrice * holding.quantity) + totalCost) / totalQty;
      holding.quantity = totalQty;
    } else {
      user.holdings.push({ characterId: character._id, quantity, avgPrice: character.price });
    }

    // 📜 Record transaction
    user.transactions.push({
      type: 'buy',
      character: character.name,
      quantity,
      price: character.price
    });

    // 📉 Decrease available shares
    character.availableShares -= quantity;

    // 📊 Record current price in price history
    character.priceHistory.push({ price: character.price });

    // 💸 ✅ Increase price by 10%
    character.price = Math.round(character.price * 1.10);

    // 💾 Save all changes
    await user.save();
    await character.save();

    res.json({ message: '✅ Purchase successful', remainingWallet: user.wallet });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});


// SELL Character (protected)
router.post('/sell', auth, async (req, res) => {
  const { characterId, quantity } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    const character = await Character.findById(characterId);
    if (!user || !character) return res.status(404).json({ error: 'User or Character not found' });

    const holding = user.holdings.find(h => h.characterId.equals(character._id));
    if (!holding || holding.quantity < quantity) {
      return res.status(400).json({ error: 'Not enough shares to sell' });
    }

    const totalGain = character.price * quantity;
    user.wallet += totalGain;

    holding.quantity -= quantity;
    if (holding.quantity === 0) {
      user.holdings = user.holdings.filter(h => !h.characterId.equals(character._id));
    }

    user.transactions.push({
      type: 'sell',
      character: character.name,
      quantity,
      price: character.price
    });

    character.availableShares += quantity;

    // 📉 Decrease price by 5%
    character.price = Math.round(character.price * 0.95);

    await user.save();
    await character.save();

    res.json({ message: '✅ Sale successful', updatedWallet: user.wallet });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});


module.exports = router;
