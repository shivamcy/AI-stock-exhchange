import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { AuthContext } from '../context/AuthContext';

function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // ✅ use login() from context

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await api.post('/api/users/login', form);

//       const token = res.data.token;
//       const isAdmin = res.data.isAdmin === true || res.data.isAdmin === 'true';

//       login(token, isAdmin); // ✅ call context login
//       localStorage.setItem('userId', res.data.userId); // keep if needed elsewhere
//       navigate('/');
//     } catch (err) {
//       setError(err.response?.data?.error || 'Login failed');
//     }
//   };
const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1. Try admin login first
      const adminRes = await api.post('/api/admin/login', form);
      const token = adminRes.data.token;
      const isAdmin = true;
  
      login(token, isAdmin); // from context
      localStorage.setItem('token', token);
      localStorage.setItem('userId', adminRes.data.admin._id);
      navigate('/');
    } catch (adminErr) {
      // 2. If admin login fails, try regular user login
      try {
        const userRes = await api.post('/api/users/login', form);
        const token = userRes.data.token;
        const isAdmin = false;
    
        login(token, isAdmin); // from context
        localStorage.setItem('token', token);
        localStorage.setItem('userId', userRes.data.userId);
        navigate('/');
      } catch (userErr) {
        setError(userErr.response?.data?.error || 'Login failed');
      }
    }
  };
  

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Login</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default Login;
