import React, { useState } from 'react';
import '../styles/auth.css';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (response.ok) {
        onLoginSuccess();
        navigate('/app');
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (error) {
      alert('Error logging in');
    }
  };

  return (
    <div className="auth-page">
      {/* Title above the container */}
      <h1 className="gradient-title">PracIn</h1>
    <div className="auth-container">
      <input type="text" placeholder="Username" onChange={e => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
      <p>Don’t have an account? <Link to="/register">Register</Link></p>
    </div>
    </div>
  );
};

export default LoginPage;