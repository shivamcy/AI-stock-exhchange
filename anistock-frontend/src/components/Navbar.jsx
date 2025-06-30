import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import NotificationBell from './NotificationBell';
import {
  Menu, X, User, Settings, LogOut,
  Home, TrendingUp, Briefcase, ListOrdered,
  Star, Shield
} from 'lucide-react';

const Navbar = () => {
  const { isLoggedIn, isAdmin, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navLinks = [
    { to: '/', label: 'Home', icon: Home, showWhen: 'always' },
    { to: '/stocks', label: 'Trade', icon: TrendingUp, showWhen: 'always' },
    { to: '/portfolio', label: 'Portfolio', icon: Briefcase, showWhen: 'loggedIn' },
    { to: '/orders', label: 'Orders', icon: ListOrdered, showWhen: 'loggedIn' },
    { to: '/ipo', label: 'IPO', icon: Star, showWhen: 'always' },
    { to: '/admin', label: 'Admin', icon: Shield, showWhen: 'admin' },
  ];

  const shouldShowLink = (condition) => {
    if (condition === 'always') return true;
    if (condition === 'loggedIn') return isLoggedIn;
    if (condition === 'admin') return isAdmin;
    return false;
  };

  return (
    <nav className="relative z-50 ">
      {/* Top Navbar */}
      <div className="backdrop-blur-xl bg-slate-900/90 border-b border-white/10 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div
              onClick={() => navigate('/')}
              className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent cursor-pointer hover:scale-105 transition-all duration-300"
            >
              Grand Line Exchange
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map(({ to, label, icon: Icon, showWhen }) =>
                shouldShowLink(showWhen) && (
                  <div
                    key={to}
                    onClick={() => navigate(to)}
                    className="flex items-center space-x-2 px-4 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-300 cursor-pointer group"
                  >
                    <Icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium">{label}</span>
                  </div>
                )
              )}

              {/* Notification */}
              {isLoggedIn && (
                <div className="px-2">
                  <NotificationBell />
                </div>
              )}

              {/* Auth Buttons */}
              <div className="flex items-center space-x-2 ml-4 pl-4 border-l border-white/10">
                {isLoggedIn ? (
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-500/20 to-pink-500/20 hover:from-red-500/30 hover:to-pink-500/30 border border-red-500/30 rounded-xl text-red-300 hover:text-red-200 transition-all duration-300 group"
                  >
                    <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-medium">Logout</span>
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => navigate('/login')}
                      className="px-4 py-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300 text-sm font-medium"
                    >
                      Login
                    </button>
                    <button
                      onClick={() => navigate('/register')}
                      className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl transition-all duration-300 text-sm font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      Register
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Mobile Toggle */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-300"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <>
          <div className="md:hidden absolute top-full left-0 right-0 z-50 backdrop-blur-xl bg-slate-900/95 border-b border-white/10 shadow-2xl">
            <div className="px-4 py-6 space-y-3">
              {navLinks.map(({ to, label, icon: Icon, showWhen }) =>
                shouldShowLink(showWhen) && (
                  <div
                    key={to}
                    onClick={() => {
                      navigate(to);
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-300 group cursor-pointer"
                  >
                    <Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span className="font-medium">{label}</span>
                  </div>
                )
              )}

              {isLoggedIn && (
                <div className="px-4 py-2">
                  <NotificationBell />
                </div>
              )}

              <div className="pt-4 border-t border-white/10">
                {isLoggedIn ? (
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center space-x-3 px-4 py-3 bg-gradient-to-r from-red-500/20 to-pink-500/20 hover:from-red-500/30 hover:to-pink-500/30 border border-red-500/30 rounded-xl text-red-300 hover:text-red-200 transition-all duration-300 group"
                  >
                    <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span className="font-medium">Logout</span>
                  </button>
                ) : (
                  <div className="space-y-3">
                    <div
                      onClick={() => {
                        navigate('/login');
                        setIsMobileMenuOpen(false);
                      }}
                      className="block w-full px-4 py-3 text-center text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-300 font-medium cursor-pointer"
                    >
                      Login
                    </div>
                    <div
                      onClick={() => {
                        navigate('/register');
                        setIsMobileMenuOpen(false);
                      }}
                      className="block w-full px-4 py-3 text-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl transition-all duration-300 font-medium shadow-lg hover:shadow-xl cursor-pointer"
                    >
                      Register
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div
            className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        </>
      )}

      {/* Decorative border line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
    </nav>
  );
};

export default Navbar;
