const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const Ipo = require('../models/Ipo');
const Character = require('../models/Character');
const adminAuth = require('../middleware/adminAuth'); // use this to protect route


// Admin login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    const admin = await User.findOne({ email });
    if (!admin || !admin.isAdmin) {
      return res.status(403).json({ error: "Access denied" });
    }
  
    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
  
    const token = jwt.sign(
      { id: admin._id, isAdmin: true },
      process.env.JWT_SECRET
    );
  
    res.json({
      token,
      isAdmin: true,
      admin: {
        email: admin.email,
        username: admin.username
      }
    });  
  });
  
// ✅ Add new character (stock)
router.post('/add-character', adminAuth, async (req, res) => {
    try {
      const { name, description, price, availableShares, trendScore } = req.body;
  
      if (!name || !price) {
        return res.status(400).json({ error: 'Name and price are required.' });
      }
  
      const character = new Character({
        name,
        description,
        price,
        availableShares: availableShares || 1000,
        trendScore: trendScore || 0
      });
  
      await character.save();
      res.json({ message: '✅ Character added successfully', character });
    } catch (err) {
      console.error("❌ Error adding character:", err);
      res.status(500).json({ error: 'Failed to add character.' });
    }
  });
  


// 🔧 POST /api/admin/create-ipo
router.post('/create-ipo', adminAuth, async (req, res) => {
  try {
    const { characterId, price, totalShares, deadline } = req.body;

    const character = await Character.findById(characterId);
    if (!character) return res.status(404).json({ error: 'Character not found' });

    const existing = await Ipo.findOne({ characterId });
    if (existing) return res.status(400).json({ error: 'IPO already exists for this character' });

    const ipo = new Ipo({ characterId, price, totalShares, deadline });
    await ipo.save();

    res.json({ message: '✅ IPO created successfully', ipo });
  } catch (err) {
    console.error("❌ IPO create error:", err);
    res.status(500).json({ error: 'Failed to create IPO' });
  }
});

// 🧠 POST /api/admin/allot-ipo/:ipoId
router.post('/allot-ipo/:ipoId', adminAuth, async (req, res) => {
    try {
      const ipo = await Ipo.findById(req.params.ipoId);
      if (!ipo) return res.status(404).json({ error: 'IPO not found' });
  
      if (ipo.allottedUsers.length > 0) {
        return res.status(400).json({ error: 'IPO already allotted' });
      }
  
      const applied = ipo.appliedUsers;
      if (applied.length < 2) {
        return res.status(400).json({ error: 'Not enough applicants to allot IPO' });
      }
  
      // ✅ Pick 2 random winners
      const shuffled = applied.sort(() => 0.5 - Math.random());
      const winners = shuffled.slice(0, 2);
  
      const character = await Character.findById(ipo.characterId);
  
      for (const userId of winners) {
        const user = await User.findById(userId);
  
        // ✅ Add shares to holdings
        const holding = user.holdings.find(h => h.characterId.toString() === character._id.toString());
        if (holding) {
          holding.quantity += 10;
          holding.avgPrice = ipo.price;
        } else {
          user.holdings.push({
            characterId: character._id,
            quantity: 10,
            avgPrice: ipo.price
          });
        }
  
        // ✅ Add transaction
        user.transactions.push({
          type: 'buy',
          character: character.name,
          quantity: 10,
          price: ipo.price
        });
  
        // ✅ Send notification
        user.notifications = user.notifications || [];
        user.notifications.push({
          message: `🎉 IPO Allotment: You received 10 shares of ${character.name} @ ${ipo.price}`,
          date: new Date()
        });
  
        await user.save();
      }
  
      // ✅ (Optional) Archive IPO before deleting
      // await ArchivedIpo.create(ipo); // if you want to save history
  
      // ✅ Delete IPO from DB
      await Ipo.findByIdAndDelete(ipo._id);
  
      res.json({ message: '✅ IPO allotted and deleted successfully', winners });
    } catch (err) {
      console.error("❌ IPO Allotment error:", err.message);
      res.status(500).json({ error: 'Failed to allot IPO' });
    }
  });
  
module.exports = router;
