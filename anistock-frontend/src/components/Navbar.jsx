import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import NotificationBell from './NotificationBell';

const Navbar = () => {
  const { isLoggedIn, isAdmin, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <Link to="/" style={{ ...styles.link, fontWeight: 'bold', fontSize: '18px' }}>Grand Line Exchange</Link>

      <div style={styles.links}>
        <Link to="/" style={styles.link}>Home</Link>
        <Link to="/stocks" style={styles.link}>Trade</Link>
        {isLoggedIn && <Link to="/portfolio" style={styles.link}>Portfolio</Link>}
        {isLoggedIn && <Link to="/orders" style={styles.link}>Orders</Link>}
        <Link to="/ipo" style={styles.link}>IPO</Link>

        {isAdmin && <Link to="/admin" style={styles.link}>Admin</Link>}
        {isLoggedIn && <NotificationBell />}
       


        {isLoggedIn ? (
          <button onClick={handleLogout} style={styles.button}>Logout</button>
        ) : (
          <>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/register" style={styles.link}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    backgroundColor: '#222',
    color: 'white',
  },
  links: {
    display: 'flex',
    gap: '15px',
    alignItems: 'center',
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '14px',
  },
  button: {
    background: 'transparent',
    border: '1px solid white',
    color: 'white',
    padding: '4px 10px',
    cursor: 'pointer',
    fontSize: '14px',
  },
};

export default Navbar;
