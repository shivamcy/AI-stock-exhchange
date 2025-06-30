import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext'; // ✅ import

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Stocks from './pages/Stocks';
import StockDetail from './pages/StockDetail';
import Portfolio from './pages/Portfolio';
import IPO from './pages/IPO';
import Admin from './pages/AdminDashboard';
import Orders from './pages/Orders';
import Notifications from './pages/Notifications';

function App() {
  return (
    <AuthProvider>
      <NotificationProvider> {/* ✅ Wrap here */}
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/stocks" element={<Stocks />} />
            <Route path="/stocks/:id" element={<StockDetail />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/ipo" element={<IPO />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/stock/:id" element={<StockDetail />} />
            <Route path="/orders" element={<Orders />} /> 
            <Route path="/notifications" element={<Notifications />} />
          </Routes>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
