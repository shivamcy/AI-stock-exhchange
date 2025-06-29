// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const characterRoutes = require('./routes/characterRoutes');
const userRoutes = require('./routes/userRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const User = require('./models/User');
const Character = require('./models/Character');
const adminRoutes = require('./routes/adminRoutes');
const ipoRoutes = require('./routes/ipoRoutes');



// App
const app = express();
const PORT = process.env.PORT || 5050;


// Middleware
app.use(cors());
app.use(express.json());
app.use('/api/characters', characterRoutes);
app.use('/api/users', userRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ipo', ipoRoutes);


// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ DB connection failed:", err));

// Routes
app.get("/", (req, res) => res.send("🟢 AniStock backend is running"));

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

//auto buy/sell
setInterval(async () => {
    try {
      const users = await User.find({ "autoOrders.active": true }).populate('autoOrders.characterId');
  
      for (const user of users) {
        for (const order of user.autoOrders) {
          const char = order.characterId;
  
          if (!order.active) continue;
  
          // BUY Trigger
          if (order.type === 'buy' && char.price <= order.triggerPrice) {
            if (char.availableShares >= order.quantity && user.wallet >= char.price * order.quantity) {
              // Execute buy
              user.wallet -= char.price * order.quantity;
              char.availableShares -= order.quantity;
  
              user.holdings.push({
                characterId: char._id,
                quantity: order.quantity,
                avgPrice: char.price
              });
  
              user.transactions.push({
                type: 'buy',
                character: char.name,
                quantity: order.quantity,
                price: char.price
              });
              user.notifications.push({
                message: `✅ Auto-${order.type} of ${order.quantity} ${char.name} @ ${char.price} executed.`,
              });
              
              order.active = false;
              await char.save();
            }
          }
  
          // SELL Trigger
          if (order.type === 'sell' && char.price >= order.triggerPrice) {
            const holding = user.holdings.find(h => h.characterId.equals(char._id));
            if (holding && holding.quantity >= order.quantity) {
              // Execute sell
              user.wallet += char.price * order.quantity;
              holding.quantity -= order.quantity;
  
              user.transactions.push({
                type: 'sell',
                character: char.name,
                quantity: order.quantity,
                price: char.price
              });
              user.notifications.push({
                message: `✅ Auto-${order.type} of ${order.quantity} ${char.name} @ ${char.price} executed.`,
              });
              
              order.active = false;
              await char.save();
            }
          }
        }
  
        await user.save();
      }
  
      console.log("🔄 Auto orders checked and executed if matched");
  
    } catch (err) {
      console.error("⚠️ Auto order loop failed:", err);
    }
  }, 60000); // check every 60 seconds