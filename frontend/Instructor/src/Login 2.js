import React from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

function Login() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Εδώ θα μπει το login logic στο μέλλον
    navigate('/post-initial-grades');
  };

  return (
    <div className="login-container">
      <Navbar />
      <main className="login-main">
        <h1>Welcome to clearSKY</h1>
        <section className="login-form-section">
          <div className="login-form-box">
            <div className="login-form-title">Please enter your credentials</div>
            <form className="login-form" onSubmit={handleSubmit}>
              <input type="text" placeholder="user name" className="login-input" />
              <input type="password" placeholder="password" className="login-input" />
              <div className="login-buttons-row">
                <button type="submit" className="login-btn">Login</button>
                <span className="login-or">or</span>
                <button type="button" className="login-btn google">Login with <span className="google-text">Google</span></button>
              </div>
            </form>
          </div>
        </section>
        <section className="login-message-area">
          <div className="login-message-title">Message area</div>
          <div className="login-message-box"></div>
        </section>
      </main>
    </div>
  );
}

export default Login; 