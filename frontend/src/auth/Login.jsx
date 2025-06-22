// src/pages/Login.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthActions } from '../hooks/useAuth';
import { GoogleLogin } from '@react-oauth/google';
//import axios from '../utils/axiosInstance';
import { authAPI } from '../utils/axiosInstance';
import { startGoogleLogin } from '../api/auth';
import { useAuth } from '../auth/AuthContext';
import './Login.css';
import logo from '../assets/clearSKY-logo.png';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [googleError, setGoogleError] = useState('');
  const { handleLogin, loading, error } = useAuthActions();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Handle URL parameters for OAuth errors (run only once)
  useEffect(() => {
    const urlError = searchParams.get('error');
    const urlMessage = searchParams.get('message');
    
    if (urlError === 'auth_failed' && urlMessage) {
      setGoogleError(decodeURIComponent(urlMessage));
    } else if (urlError === 'server_error') {
      setGoogleError('Server error occurred during Google authentication');
    } else if (urlError === 'token_error') {
      setGoogleError('Failed to generate authentication token');
    }
  }, [searchParams]);

  // Redirect if user is already authenticated (run only when user changes)
  useEffect(() => {
    if (user) {
      console.log('User already authenticated, redirecting...');
      navigate('/redirect', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleLogin(email.trim(), password);
  };

  // Handle Google OAuth with id_token (client-side)
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setGoogleError('');
      console.log('Google OAuth credential received');
      
      // Decode the JWT token to get email
      const tokenPayload = JSON.parse(atob(credentialResponse.credential.split('.')[1]));
      const googleEmail = tokenPayload.email;
      
      console.log('Attempting Google login for:', googleEmail);
      
      // Verify with backend using the dedicated id_token endpoint
      const res = await authAPI.post('/auth/verify-google-token', {
        email: googleEmail,
        id_token: credentialResponse.credential
      });
      
      const { token, user } = res.data;
      localStorage.setItem('token', token);
      
      // 🔧 FIX: Store user data in context to prevent infinite redirect loop
      localStorage.setItem('user', JSON.stringify(user));
      
      console.log('Google login successful for:', user.full_name);
      
      // Force page reload to let AuthContext pick up the new user data
      window.location.href = '/redirect';
    } catch (err) {
      console.error('Google login failed:', err);
      const errorMessage = err.response?.data?.error || 'Google authentication failed';
      setGoogleError(errorMessage);
    }
  };

  const handleGoogleError = (err) => {
    console.error('Google login error:', err);
    setGoogleError('Google authentication failed. Please try again.');
  };

  // Handle Google OAuth with redirect flow (server-side)
  const handleGoogleRedirect = () => {
    setGoogleError('');
    startGoogleLogin();
  };

  // Don't render login form if user is already authenticated
  if (user) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div style={{ fontSize: '18px', color: '#333' }}>
          🔄 Redirecting...
        </div>
      </div>
    );
  }

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
              </div>

              {error && <div className="login-error">{error}</div>}
            </form>

            {/* Google OAuth Options */}
            <div className="google-login-section">
              <div className="login-divider">
                <span>or</span>
              </div>
              
              <div className="google-login-options">
                {/* Client-side Google OAuth */}
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  text="signin_with"
                  shape="rectangular"
                  logo_alignment="left"
                  width="280px"
                />
                
                {/* Alternative: Server-side redirect */}
                <div className="google-redirect-option">
                  <button 
                    type="button" 
                    onClick={handleGoogleRedirect}
                    className="google-redirect-btn"
                  >
                    🔗 Sign in with Google (Redirect)
                  </button>
                </div>
              </div>

              {googleError && (
                <div className="login-error google-error">
                  {googleError}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
