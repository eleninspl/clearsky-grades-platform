/*import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthActions } from '../hooks/useAuth';
import './Login.css';
import logo from '../assets/clearSKY-logo.png';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { handleLogin, loading, error } = useAuthActions();

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin(email, password);
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
                required
              />
              <input
                type="password"
                placeholder="password"
                className="login-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="login-buttons-row">
                <button type="submit" className="login-btn" disabled={loading}>
                  {loading ? 'Logging in...' : 'Login'}
                </button>
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
*/


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthActions } from '../hooks/useAuth';
import './Login.css';
import logo from '../assets/clearSKY-logo.png';

/**
 * Fully‑featured Login page
 * ---------------------------------------------------
 * • Χρησιμοποιεί το custom hook `useAuthActions()` για login
 * • Αποθηκεύει το JWT & user στο localStorage (στο hook)
 * • Με `useEffect` κάνει αυτόματο redirect αν υπάρχει token
 * • Το `navigate(..., { replace: true })` μέσα στο hook
 *   διασφαλίζει ότι το back‑button δεν επιστρέφει σε protected σελίδες
 */
export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // custom hook όπου ζει η λογική login / token storage
  const { handleLogin, loading, error } = useAuthActions();

  const navigate = useNavigate();

  // Αν ο χρήστης έχει ήδη έγκυρο token, πήγαινε κατευθείαν dashboard
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) navigate('/representative/dashboard', { replace: true });
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin(email.trim(), password);
  };

  return (
    <div className="login-container">
      {/* Logo bar */}
      <div className="login-logo-bar">
        <img src={logo} alt="clearSKY logo" className="login-img-logo" />
      </div>

      {/* Main form section */}
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
                required
              />

              <input
                type="password"
                placeholder="password"
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

              {/* Error banner */}
              {error && <div className="login-error">{error}</div>}
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}
