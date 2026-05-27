import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../services/axiosInstance';
import { toast } from 'react-toastify';
import './Auth.css';

function Signup() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== password2) {
      setError('Confirm password must match security password.');
      toast.warn('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await axiosInstance.post('register/', {
        username,
        email,
        password,
      });
      
      toast.success('Registration successful! Please log in with your credentials.');
      navigate('/login'); // After signup, go to login
    } catch (err) {
      console.error(err);
      if (err.response && err.response.data) {
        // Capture Django's rich password validation errors
        const data = err.response.data;
        if (data.password) {
          setError(Array.isArray(data.password) ? data.password.join(' ') : data.password);
        } else if (data.username) {
          setError(Array.isArray(data.username) ? data.username.join(' ') : data.username);
        } else if (data.email) {
          setError(Array.isArray(data.email) ? data.email.join(' ') : data.email);
        } else {
          setError(data.detail || 'Registration failed. Please check inputs.');
        }
      } else {
        setError('Connection issues during registration. Please try again.');
      }
      toast.error('Failed to create account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page section-padding">
      <div className="auth-wrapper" data-aos="zoom-in">
        <div className="auth-card glass-card">
          <div className="auth-logo-brand">
            <Link to="/" className="luxury-logo">Elegance</Link>
          </div>
          
          <h2 className="auth-title">Register Account</h2>
          <p className="auth-subtitle">Join our exclusive lounge to curated luxury selections and complimentary premium delivery.</p>

          {error && <div className="auth-error-banner">{error}</div>}

          <form onSubmit={handleSignup} className="auth-form-layout">
            <div className="form-group mb-4">
              <label className="luxury-label" htmlFor="username">Select Username</label>
              <input 
                id="username"
                type="text" 
                className="luxury-input"
                placeholder="Username (e.g. Samuel)" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required 
              />
            </div>

            <div className="form-group mb-4">
              <label className="luxury-label" htmlFor="email">Email Address</label>
              <input 
                id="email"
                type="email" 
                className="luxury-input"
                placeholder="youremail@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
            
            <div className="form-group mb-4">
              <label className="luxury-label" htmlFor="password">Security Password</label>
              <input 
                id="password"
                type="password" 
                className="luxury-input"
                placeholder="Enter password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>

            <div className="form-group mb-5">
              <label className="luxury-label" htmlFor="password2">Confirm Security Password</label>
              <input 
                id="password2"
                type="password" 
                className="luxury-input"
                placeholder="Confirm password" 
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                required 
              />
            </div>

            <button 
              type="submit" 
              className="btn-luxury btn-luxury-solid w-100" 
              disabled={loading}
            >
              {loading ? 'Securing Credentials...' : 'Submit Exclusive Registration'}
            </button>
          </form>

          <div className="auth-switch-prompt mt-4">
            <span>Already a Member?</span>
            <Link to="/login" className="auth-switch-link ms-2">Access session</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
