import React from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import logo from './assets/clearSKY-logo.png';

function Login() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Εδώ θα μπει το login logic στο μέλλον
    navigate('/course-statistics');
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
      </main>
    </div>
  );
}

export default Login; 