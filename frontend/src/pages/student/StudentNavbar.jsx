import React, { useState, useRef, useEffect } from 'react';
import './StudentNavbar.css';
import logo from '../../assets/clearSKY-logo.png';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function StudentNavbar() {
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
    <nav className="student-navbar">
      <div className="student-navbar-left">
        <img
          src={logo}
          alt="clearSKY logo"
          className="student-navbar-img-logo"
          onClick={() => navigate('/student/dashboard')}
        />
        <button className="student-navbar-link" onClick={() => navigate('/student/dashboard')}>
          My Dashboard
        </button>
        <button className="student-navbar-link" onClick={() => navigate('/student/courses')}>
          My Courses
        </button>
      </div>

      <div className="student-navbar-right">
        <div className="student-navbar-profile-wrapper" ref={profileDropdownRef}>
          <button
            className="student-navbar-link student-navbar-profile-btn"
            onClick={() => setShowProfileDropdown(v => !v)}
          >
            Student's Name
          </button>
          {showProfileDropdown && (
            <div className="student-navbar-profile-dropdown">
              <button className="student-navbar-profile-dropdown-btn">Profile</button>
              <button className="student-navbar-profile-dropdown-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
        <div className="student-navbar-profile-pic">
          <img src="https://www.gravatar.com/avatar/?d=mp" alt="profile" />
        </div>
      </div>
    </nav>
  );
}

export default StudentNavbar;
