import React, { useState } from 'react';
import '../styles/auth.css';
import { useNavigate, Link } from 'react-router-dom';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (response.ok) {
        alert('Registration successful!');
        navigate('/login');
      } else {
        alert(data.message || 'Registration failed');
      }
    } catch (error) {
      alert('Error registering');
    }
  };

  return (
    <div className="auth-page">
      {/* Title above the container */}
      <h1 className="gradient-title">PracIn</h1>
    
    <div className="auth-container">
     
      <input type="text" placeholder="Username" onChange={e => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} />
      <button onClick={handleRegister}>Register</button>
      <p>Already have an account? <Link to="/login">Login</Link></p>
    </div>
    </div>
  );
};

export default RegisterPage;