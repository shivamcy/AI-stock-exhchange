const axios = require('axios');
const express = require('express');
const router = express.Router();
const Character = require('../models/Character');

// GET all characters
router.get('/', async (req, res) => {
  try {
    const characters = await Character.find();
    res.json(characters);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST a new character
router.post('/', async (req, res) => {
  const { name, anime, price, availableShares } = req.body;

  try {
    const newChar = new Character({
      name,
      anime,
      price,
      availableShares,
      trendScore: 0,
      sentimentScore: 0,
      youtubeMentions: 0,
      priceHistory: [{ price }]
    });

    await newChar.save();
    res.status(201).json(newChar);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Trending Characters API
router.get('/trending', async (req, res) => {
    try {
      const topCharacters = await Character.find({})
        .sort({ trendScore: -1 }) // Highest trendScore first
        .limit(3);
  
      res.json(topCharacters);
    } catch (err) {
      console.error("🔥 Error fetching trending characters:", err);
      res.status(500).json({ error: 'Failed to fetch trending characters' });
    }
  });
// chart of character(stock)
  router.get('/:id/details', async (req, res) => {
    try {
      const character = await Character.findById(req.params.id);
      if (!character) return res.status(404).json({ error: 'Character not found' });
  
      res.json({
        name: character.name,
        anime: character.anime,
        price: character.price,
        availableShares: character.availableShares,
        priceHistory: character.priceHistory
      });
    } catch (err) {
      console.error("❌ Error fetching stock details:", err);
      res.status(500).json({ error: 'Error fetching stock details' });
    }
  });
  // routes/characterRoutes.js
router.get('/graph-data', async (req, res) => {
    try {
      const characters = await Character.find().select('name price');
      
      const graphData = characters.map(char => ({
        name: char.name,
        currentPrice: char.price,
        // placeholder trend if no history yet
        trend: [
          char.price - 50,
          char.price - 30,
          char.price - 10,
          char.price,
          char.price + 20
        ]
      }));
  
      res.json({ data: graphData });
    } catch (err) {
      console.error("Graph API error:", err);
      res.status(500).json({ error: "Failed to fetch graph data" });
    }
  });
  
  //open roter for ai
  router.get('/:id/predict', async (req, res) => {
    try {
      const character = await Character.findById(req.params.id);
      if (!character) return res.status(404).json({ error: 'Character not found' });
  
      const prompt = `
  You're an anime stock market prediction AI. The current stock price of "${character.name}" is ₹${character.price}.
  Predict the next 3 likely prices based on anime popularity trends. Respond ONLY with a JSON array like: [420, 430, 440].
  `;
  
      const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: 'deepseek/deepseek-chat-v3-0324:free',
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ]
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
            'HTTP-Referer': 'http://localhost:5050', // or your production domain
            'X-Title': 'AniStock',
            'Content-Type': 'application/json'
          }
        }
      );
  
      const aiText = response.data.choices[0].message.content.trim();
  
      let predictedPrices;
      try {
        predictedPrices = JSON.parse(aiText);
      } catch (err) {
        console.warn("❗ AI didn't return JSON. Fallback used.");
        predictedPrices = [
          character.price + 10,
          character.price + 15,
          character.price + 20
        ];
      }
  
      res.json({
        character: character.name,
        currentPrice: character.price,
        predictedPrices
      });
  
    } catch (error) {
      console.error("❌ AI Prediction Error:", error.message);
      res.status(500).json({ error: 'AI prediction failed' });
    }
  });

module.exports = router;
