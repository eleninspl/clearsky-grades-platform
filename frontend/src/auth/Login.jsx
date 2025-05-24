import React, { useState } from 'react';
import axios from '../utils/axiosInstance';

import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import './Login.css';
import logo from '../assets/clearSKY-logo.png';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5001/auth/login', {
        email,
        password,
      });
  
      const { token, user } = res.data;
  
      localStorage.setItem('token', token);  
      login(user);                           
      navigate('/');
    } catch (error) {
      setError('Invalid credentials');
    }
  };


  return (
    <div className="login-container">
      <div className="login-logo-bar">
        <img src={logo} alt="clearSKY logo" className="login-img-logo" />
      </div>
      <main className="login-main">
        <section className="login-form-section">
          <div className="login-form-box">
            <div className="login-form-title">Please enter your credentials</div>
            <form className="login-form" onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="email"
                className="login-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="password"
                className="login-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="login-buttons-row">
                <button type="submit" className="login-btn">Login</button>
              </div>
              {error && <div className="login-error">{error}</div>}
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Login;
