// src/pages/Login.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthActions } from '../hooks/useAuth';
import { GoogleLogin } from '@react-oauth/google';
//import axios from '../utils/axiosInstance';
import { authAPI } from '../utils/axiosInstance';
import './Login.css';
import logo from '../assets/clearSKY-logo.png';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { handleLogin, loading, error } = useAuthActions();
  const navigate = useNavigate();

  // Αν υπάρχει ήδη token, κάνε redirect
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/redirect', { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleLogin(email.trim(), password);
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await authAPI.post('/auth/google', {
        id_token: credentialResponse.credential,
      });
      const { token } = res.data;
      localStorage.setItem('token', token);
      navigate('/redirect');
    } catch (err) {
      console.error('Google login failed:', err);
      // You can also set an error state here to show a message in the UI
    }
  };

  const handleGoogleError = (err) => {
    console.error('Google login error:', err);
  };

  return (
    <div className="login-container">
      {/* Logo */}
      <div className="login-logo-bar">
        <img src={logo} alt="clearSKY logo" className="login-img-logo" />
      </div>

      {/* Form */}
      <main className="login-main">
        <section className="login-form-section">
          <div className="login-form-box">
            <div className="login-form-title">Please enter your credentials</div>

            <form className="login-form" onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="Email"
                className="login-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <input
                type="password"
                placeholder="Password"
                className="login-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <div className="login-buttons-row">
                <button type="submit" className="login-btn" disabled={loading}>
                  {loading ? 'Logging in…' : 'Login'}
                </button>
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  text="signin_with"
                  shape="rectangular"
                  logo_alignment="left"
                  width="210px"
                />
              </div>

              {error && <div className="login-error">{error}</div>}
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}
