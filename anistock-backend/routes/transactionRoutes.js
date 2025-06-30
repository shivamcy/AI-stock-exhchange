const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Character = require('../models/Character');
const auth = require('../middleware/authMiddleware');

// BUY Character (protected)
router.post('/buy', auth, async (req, res) => {
  const { characterId, quantity } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    const character = await Character.findById(characterId);
    if (!user || !character)
      return res.status(404).json({ error: 'User or Character not found' });

    const totalCost = character.price * quantity;
    if (user.wallet < totalCost)
      return res.status(400).json({ error: 'Not enough Berries' });

    if (character.availableShares < quantity)
      return res.status(400).json({ error: 'Not enough shares available' });

    // 💸 Deduct wallet and update holdings
    user.wallet -= totalCost;

    let holding = user.holdings.find(h => h.characterId.equals(character._id));
    if (holding) {
      const totalQty = holding.quantity + quantity;
      holding.avgPrice = ((holding.avgPrice * holding.quantity) + totalCost) / totalQty;
      holding.quantity = totalQty;
    } else {
      user.holdings.push({
        characterId: character._id,
        quantity,
        avgPrice: character.price
      });
    }

    // 🧾 Record transaction
    user.transactions.push({
      type: 'buy',
      character: character.name,
      quantity,
      price: character.price
    });

    // 📊 Stock updates
    character.availableShares -= quantity;
    character.priceHistory.push({ price: character.price });
    character.price = Math.round(character.price * 1.10);

    // 🔔 Notification
    user.notifications.push({
      message: `📈 Bought ${quantity} share(s) of ${character.name} at ${character.price} berries`,
      date: new Date(),
      read: false
    });

    // 💾 Save changes
    await user.save();
    await character.save();

    res.json({ message: '✅ Purchase successful', remainingWallet: user.wallet });
  } catch (err) {
    console.error('Buy error:', err);
    res.status(500).json({ error: 'Server error during purchase' });
  }
});

// SELL Character (protected)
router.post('/sell', auth, async (req, res) => {
  const { characterId, quantity } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    const character = await Character.findById(characterId);
    if (!user || !character)
      return res.status(404).json({ error: 'User or Character not found' });

    const holding = user.holdings.find(h => h.characterId.equals(character._id));
    if (!holding || holding.quantity < quantity)
      return res.status(400).json({ error: 'Not enough shares to sell' });

    const totalGain = character.price * quantity;
    user.wallet += totalGain;

    holding.quantity -= quantity;
    if (holding.quantity === 0) {
      user.holdings = user.holdings.filter(h => !h.characterId.equals(character._id));
    }

    // 📜 Record transaction
    user.transactions.push({
      type: 'sell',
      character: character.name,
      quantity,
      price: character.price
    });

    // 📉 Stock updates
    character.availableShares += quantity;
    character.price = Math.round(character.price * 0.95);

    // 🔔 Notification
    user.notifications.push({
      message: `📉 Sold ${quantity} share(s) of ${character.name} at ${character.price} berries`,
      date: new Date(),
      read: false
    });

    // 💾 Save changes
    await user.save();
    await character.save();

    res.json({ message: '✅ Sale successful', updatedWallet: user.wallet });
  } catch (err) {
    console.error('Sell error:', err);
    res.status(500).json({ error: 'Server error during sale' });
  }
});

module.exports = router;
