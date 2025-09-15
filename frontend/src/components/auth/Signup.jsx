import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './Auth.css'; // Reuse same styles!

function Signup() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== password2) {
      setError('Passwords do not match.');
      return;
    }

    try {
      await axios.post('http://localhost:8000/api/register/', {
        username,
        email,
        password,
      });
      navigate('/login'); // After signup, go to login
    } catch (err) {
      setError('Failed to create account. Try again.');
    }
  };

  return (
    <>
    <div className="navbar-center">
          <Link to="/" className="logo">Jewelry</Link>
        </div>
    <div className="auth-container">
      <h2>Sign Up</h2>
      {error && <p className="error-msg">{error}</p>}
      <form onSubmit={handleSignup} className="auth-form">
        <input 
          type="text" 
          placeholder="Username" 
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required 
        />
        <input 
          type="email" 
          placeholder="Email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required 
        />
        <input 
          type="password" 
          placeholder="Confirm Password" 
          value={password2}
          onChange={(e) => setPassword2(e.target.value)}
          required 
        />
        <button type="submit">Sign Up</button>
      </form>
      <p className="auth-switch">
        Already have an account? <a href="/login">Login</a>
      </p>
    </div>
    </>
  );
}

export default Signup;

