import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import axiosInstance from '../services/axiosInstance';
import { toast } from 'react-toastify';
import './Auth.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await axiosInstance.post('token/', {
        username: email,
        password: password, 
      });

      const { access, refresh, user } = response.data;
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);
      
      // Update global auth store state
      login(user);
      
      toast.success(`Welcome back, ${user.username}!`);
      navigate('/'); // Redirect to homepage
    } catch (err) {
      console.error(err);
      setError('Invalid credentials. Please verify your details.');
      toast.error('Authentication failed.');
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
          
          <h2 className="auth-title">Welcome Back</h2>
          <p className="auth-subtitle">Sign in to your private account to access your curated collections.</p>

          {error && <div className="auth-error-banner">{error}</div>}

          <form onSubmit={handleLogin} className="auth-form-layout">
            <div className="form-group mb-4">
              <label className="luxury-label" htmlFor="email">Email address / Username</label>
              <input 
                id="email"
                type="text" 
                className="luxury-input"
                placeholder="Enter email or username" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
            
            <div className="form-group mb-5">
              <div className="d-flex justify-content-between align-items-center">
                <label className="luxury-label" htmlFor="password">Security Password</label>
              </div>
              <input 
                id="password"
                type="password" 
                className="luxury-input"
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>

            <button 
              type="submit" 
              className="btn-luxury btn-luxury-solid w-100" 
              disabled={loading}
            >
              {loading ? 'Verifying Identity...' : 'Access Private Lounge'}
            </button>
          </form>

          <div className="auth-switch-prompt mt-4">
            <span>New Connoisseur?</span>
            <Link to="/signup" className="auth-switch-link ms-2">Create credentials</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
