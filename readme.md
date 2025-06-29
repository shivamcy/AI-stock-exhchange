# 🏴‍☠️Grand Line Exchange

Welcome to **Grand Line Exchange**, an AI-powered anime stock exchange where your favorite anime characters become tradable stocks. Inspired by the adventurous world of *One Piece*, this platform combines anime fandom with stock market simulation and interactive trading.

> 🚀 Built with the **MERN Stack** (MongoDB, Express.js, React.js, Node.js)  
> 🎯 AI-Powered Price Trends + IPO Simulation  
> 🔐 Admin Panel to manage characters and IPOs  
> 💼 User portfolio with live P/L tracking

---

## 🌟 Features

### 📈 General Users
- 🔍 Browse & search anime character stocks
- 🛒 **Buy/Sell** character stocks with dynamic pricing
- 📊 Real-time **portfolio performance** tracker
- 📜 Apply for **Initial Public Offerings (IPOs)**
- 🧾 View and manage **auto orders**
- 📬 Get IPO allotment notifications

### 🧑‍💻 Admin Panel
- ➕ Add new characters to the exchange
- 🧨 Create and allot IPOs
- 👑 Protected admin-only access via token

---

## 🔧 Tech Stack

| Layer     | Tech                           |
|-----------|--------------------------------|
| Frontend  | React.js, Chart.js, Axios      |
| Backend   | Node.js, Express.js            |
| Database  | MongoDB, Mongoose              |
| Auth      | JWT, Bcrypt                    |
| Styling   | CSS, Inline Styles             |

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/shivamcy/AI-stock-exhchange.git
cd AI-stock-exhchange
```
### 2. Setup Backend
```bash
cd backend
npm install
touch .env
```
# Add the following in .env
```bash
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```
### 2. Setup Frontend
```bash
cd ../frontend
npm install
npm run dev
```
### 🧠 AI Features (Planned/Experimental)
   -📉 Dynamic stock price changes on buy/sell

   -🔮 Predictive trend scoring (TrendScore)

   -🤖 Real-time chart updates

### 🙌 Developer
    👨‍💻 Shivam Chaudhary
    GitHub: shivamcy

    “Wearing the straw hat while building AniStock ☠️”