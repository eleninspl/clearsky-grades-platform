import React, { useState, useRef, useEffect } from 'react';
import './RepNavbar.css';
import { Link, useNavigate } from 'react-router-dom';
import logo from './assets/clearSKY-logo.png';

function RepNavbar() {
  const navigate = useNavigate();
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
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src={logo} alt="clearSKY logo" className="navbar-img-logo" />
        <Link to="/register-institution" className="navbar-link">Home</Link>
        <Link to="/rep-grades" className="navbar-link">Grades</Link>
        <Link to="/rep-credits" className="navbar-link">Credits</Link>
      </div>
      <div className="navbar-right">
        <div className="navbar-profile-wrapper" ref={profileDropdownRef}>
          <button className="navbar-link navbar-profile-btn" onClick={() => setShowProfileDropdown(v => !v)}>
            Profile
          </button>
          {showProfileDropdown && (
            <div className="navbar-profile-dropdown">
              <button className="navbar-profile-dropdown-btn">Profile</button>
              <button className="navbar-profile-dropdown-btn" onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
        <div className="navbar-profile-pic">
          <img src="https://www.gravatar.com/avatar/?d=mp" alt="profile" />
        </div>
      </div>
    </nav>
  );
}

export default RepNavbar; 