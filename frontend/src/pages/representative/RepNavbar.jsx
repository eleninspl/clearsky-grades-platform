import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './RepNavbar.css';
import logo from '../../assets/clearSKY-logo.png';
import { useAuthActions } from '../../hooks/useAuth';
import { useAuth } from '../../auth/AuthContext';

function RepNavbar() {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const profileDropdownRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const { handleLogout } = useAuthActions();

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
            {user?.full_name || 'User'}
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
