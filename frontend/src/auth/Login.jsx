import React, { useState } from 'react';
import './Login.css';
import logo from '../assets/clearSKY-logo.png';

function Login({ setCurrentComponent }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Map of valid credentials to components and roles
  const credentialsMap = {
    instructor: {
      password: 'instructor',
      component: 'CourseStatistics',
      role: 'INSTRUCTOR'
    },
    represent: {
      password: 'represent',
      component: 'RepStatistics',
      role: 'INST_REP'
    },
    student: {
      password: 'student',
      component: 'StudentDashboard',
      role: 'STUDENT'
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const user = credentialsMap[username];
    if (user && user.password === password) {
      localStorage.setItem('role', user.role);
      setCurrentComponent(user.component);
    } else {
      setError('Invalid username or password');
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
                type="text"
                placeholder="user name"
                className="login-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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