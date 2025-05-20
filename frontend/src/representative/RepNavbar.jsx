import React, { useState, useRef, useEffect } from 'react';
import './RepNavbar.css';
import logo from '../assets/clearSKY-logo.png';

function RepNavbar({ setCurrentComponent }) {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const profileDropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setShowProfileDropdown(false);
    localStorage.removeItem('role');
    setCurrentComponent('Login');
  };

  return (
    <nav className="rep-navbar">
      <div className="rep-navbar-left">
        <img src={logo} alt="clearSKY logo" className="rep-navbar-img-logo" />
        <button className="rep-navbar-link" onClick={() => setCurrentComponent('RepStatistics')}>Statistics</button>
        <button className="rep-navbar-link" onClick={() => setCurrentComponent('RepCredits')}>Credits</button>
        <button className="rep-navbar-link" onClick={() => setCurrentComponent('AddUser')}>Add User</button>
      </div>
      <div className="rep-navbar-right">
        <div className="rep-navbar-profile-wrapper" ref={profileDropdownRef}>
          <button className="rep-navbar-link rep-navbar-profile-btn" onClick={() => setShowProfileDropdown(v => !v)}>
            Profile
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