const express = require('express');
const router = express.Router();
const Ipo = require('../models/Ipo');
const User = require('../models/User');
const auth = require('../middleware/authMiddleware'); // user login middleware

// 👤 POST /api/ipo/apply/:ipoId
router.post('/apply/:ipoId', auth, async (req, res) => {
  try {
    const ipo = await Ipo.findById(req.params.ipoId);
    if (!ipo) return res.status(404).json({ error: 'IPO not found' });

    const userId = req.user.id;

    if (new Date() > new Date(ipo.deadline)) {
      return res.status(400).json({ error: 'IPO has closed' });
    }

    if (ipo.appliedUsers.includes(userId)) {
      return res.status(400).json({ error: 'You already applied for this IPO' });
    }

    ipo.appliedUsers.push(userId);
    await ipo.save();

    res.json({ message: '✅ IPO application successful' });
  } catch (err) {
    console.error("❌ IPO apply error:", err);
    res.status(500).json({ error: 'Failed to apply for IPO' });
  }
});
router.get('/', auth, async (req, res) => {
  try {
    const ipos = await Ipo.find()
      .populate('characterId', 'name')
      .lean();

    const updated = ipos.map((ipo) => ({
      ...ipo,
      character: ipo.characterId,
      alreadyApplied: ipo.appliedUsers.includes(req.user.id)
    }));

    res.json(updated);
  } catch (err) {
    console.error("❌ IPO list error:", err);
    res.status(500).json({ error: 'Failed to fetch IPOs' });
  }
});


module.exports = router;
