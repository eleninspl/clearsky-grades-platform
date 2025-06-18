import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './RepNavbar.css';
import axios from 'axios';    
import logo from '../../assets/clearSKY-logo.png';

function RepNavbar() {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const profileDropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
  setShowProfileDropdown(false);

  const token = localStorage.getItem('token');
  try {
    await fetch('http://localhost:5001/auth/logout', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    });
  } catch (err) {
    console.error('Logout failed:', err);
  }

  // Καθάρισμα
  localStorage.removeItem('token');
  localStorage.removeItem('user');

  delete axios.defaults.headers.common['Authorization'];  // ⬅️ σημαντικό

  // Προσθήκη replace για να μη δουλεύει το Back
  navigate('/login', { replace: true });
};



  return (
    <nav className="rep-navbar">
      <div className="rep-navbar-left">
        <img src={logo} alt="clearSKY logo" className="rep-navbar-img-logo" />
        <button className="rep-navbar-link" onClick={() => navigate('/representative/dashboard')}>My Dashboard</button>
        <button className="rep-navbar-link" onClick={() => navigate('/representative/credits')}>Credits</button>
        <button className="rep-navbar-link" onClick={() => navigate('/representative/add-user')}>Add User</button>
      </div>
      <div className="rep-navbar-right">
        <div className="rep-navbar-profile-wrapper" ref={profileDropdownRef}>
          <button className="rep-navbar-link rep-navbar-profile-btn" onClick={() => setShowProfileDropdown(v => !v)}>
            Representative's Name
          </button>
          {showProfileDropdown && (
            <div className="rep-navbar-profile-dropdown">
              <button className="rep-navbar-profile-dropdown-btn">Profile</button>
              <button className="rep-navbar-profile-dropdown-btn" onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
        <div className="rep-navbar-profile-pic">
          <img src="https://www.gravatar.com/avatar/?d=mp" alt="profile" />
        </div>
      </div>
    </nav>
  );
}

export default RepNavbar;
