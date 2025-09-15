import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './Auth.css'; // We'll style it nicely here

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();


  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/token/', {
        username: email,
        password: password, 
      });
      console.log(response.data);

      const { access, refresh, user } = response.data;
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);
      localStorage.setItem('user', JSON.stringify(user));
    //   setIsLoggedIn(true);  // this triggers Navbar update

      navigate('/'); // Redirect after login
    } catch (err) {
      setError('Invalid email or password.');
    }
  };
  return (
   <>
        <div className="navbar-center">
          <Link to="/" className="logo">Jewelry</Link>
        </div>
    <div className="auth-container">
      <h2>Login</h2>
      {error && <p className="error-msg">{error}</p>}
      <form onSubmit={handleLogin} className="auth-form">
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
        <button type="submit">Login</button>
      </form>
      <p className="auth-switch">
        Don't have an account? <a href="/signup">Sign up</a>
      </p>
    </div>
   </>
  );
}

export default Login;


