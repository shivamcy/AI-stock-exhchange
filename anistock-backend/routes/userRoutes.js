const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/authMiddleware');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'secret'; // ideally use env var

// 📌 REGISTER
router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if user exists
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email already registered' });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({ username, email, passwordHash });
    await user.save();

    res.status(201).json({ message: '✅ Registration successful', userId: user._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

// 🔐 LOGIN
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '2h' });

    res.json({ message: '✅ Login successful', token, userId: user._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// ✅ GET Portfolio
router.get('/portfolio', auth, async (req, res) => {
    try {
      const user = await User.findById(req.user.id).populate('holdings.characterId');
  
      if (!user) return res.status(404).json({ error: 'User not found' });
  
      let totalInvested = 0;
      let currentValue = 0;
  
      const holdingsDetailed = user.holdings.map(h => {
        const invested = h.avgPrice * h.quantity;
        const nowWorth = h.characterId.price * h.quantity;
  
        totalInvested += invested;
        currentValue += nowWorth;
  
        return {
          character: h.characterId.name,
          anime: h.characterId.anime,
          quantity: h.quantity,
          avgBuyPrice: h.avgPrice,
          currentPrice: h.characterId.price,
          invested,
          nowWorth,
          profitLoss: nowWorth - invested
        };
      });
  
      res.json({
        wallet: user.wallet,
        totalInvested,
        currentValue,
        netProfitLoss: currentValue - totalInvested,
        holdings: holdingsDetailed,
        recentTransactions: user.transactions.slice(-5).reverse()
      });
    } catch (err) {
        console.error("❌ Portfolio error:", err); // 🪵 log full error
        res.status(500).json({ error: 'Error fetching portfolio' });
    }
  });
  //suto order stock
  router.post('/auto-order', auth, async (req, res) => {
    const { characterId, type, quantity, triggerPrice } = req.body;
  
    try {
      const user = await User.findById(req.user.id);
      user.autoOrders.push({ characterId, type, quantity, triggerPrice });
      await user.save();
  
      res.json({ message: '✅ Auto order added' });
    } catch (err) {
      console.error('❌ Auto order error:', err);
      res.status(500).json({ error: 'Failed to add auto order' });
    }
  });

  // 📄 View all active & past auto orders
router.get('/auto-orders', auth, async (req, res) => {
    try {
      const user = await User.findById(req.user.id).populate('autoOrders.characterId');
  
      if (!user) return res.status(404).json({ error: 'User not found' });
  
      const orders = user.autoOrders.map(o => ({
        _id: o._id,
        characterName: o.characterId?.name,
        anime: o.characterId?.anime,
        type: o.type,
        quantity: o.quantity,
        triggerPrice: o.triggerPrice,
        active: o.active,
        createdAt: o.createdAt
      }));
  
      res.json(orders);
    } catch (err) {
      console.error("❌ Fetch auto orders error:", err);
      res.status(500).json({ error: 'Could not fetch auto orders' });
    }
  });
  // 🗑 Delete a specific auto order
router.delete('/auto-orders/:orderId', auth, async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ error: 'User not found' });
  
      const orderId = req.params.orderId;
  
      const index = user.autoOrders.findIndex(o => o._id.toString() === orderId);
      if (index === -1) return res.status(404).json({ error: 'Order not found' });
  
      user.autoOrders.splice(index, 1);
      await user.save();
  
      res.json({ message: '🗑 Auto order deleted successfully' });
    } catch (err) {
      console.error("❌ Delete auto order error:", err);
      res.status(500).json({ error: 'Could not delete auto order' });
    }
  });
  // 🧾 Get user's full transaction history
router.get('/transactions', auth, async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ error: 'User not found' });
  
      // Sort transactions by most recent first
      const sorted = user.transactions.sort((a, b) => b.date - a.date);
  
      res.json(sorted);
    } catch (err) {
      console.error("❌ Error fetching transactions:", err);
      res.status(500).json({ error: 'Failed to fetch transaction history' });
    }
  });
  //get notifications
  router.get('/notifications', auth, async (req, res) => {
    console.log("🔔 /notifications called by:", req.user.id);
    try {
      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ error: 'User not found' });
  
      // Sort by newest first
      const sorted = user.notifications.sort((a, b) => b.date - a.date);
      res.json(sorted);
    } catch (err) {
      console.error("❌ Notification fetch error:", err);
      res.status(500).json({ error: 'Failed to fetch notifications' });
    }
  });   
  // ✅ Mark all notifications as read
router.put('/notifications/read', auth, async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      user.notifications.forEach(n => n.read = true);
      await user.save();
      res.json({ message: "🔕 All notifications marked as read" });
    } catch (err) {
      console.error("❌ Mark read error:", err);
      res.status(500).json({ error: 'Failed to update notifications' });
    }
  });
  // Get unread notification count
router.get('/notifications/unread-count', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const unreadCount = user.notifications.filter(n => !n.read).length;
    res.json({ unreadCount });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch unread count' });
  }
});

  // routes/userRoutes.js
router.post('/auto-order', auth, async (req, res) => {
  const { characterId, quantity, triggerPrice, type } = req.body;
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  user.autoOrders.push({ characterId, quantity, triggerPrice, type, active: true });
  await user.save();
  res.json({ message: '✅ Auto-order placed' });
});


module.exports = router;
