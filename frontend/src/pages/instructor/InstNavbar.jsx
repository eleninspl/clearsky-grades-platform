import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './InstNavbar.css';
import { useAuthActions } from '../../hooks/useAuth';
import logo from '../../assets/clearSKY-logo.png';

function Navbar({ setCurrentComponent }) {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showGradesDropdown, setShowGradesDropdown] = useState(false);
  const profileDropdownRef = useRef(null);
  const gradesDropdownRef = useRef(null);
  const navigate = useNavigate();

  // Κλείσιμο dropdown όταν κάνεις click εκτός
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
      if (gradesDropdownRef.current && !gradesDropdownRef.current.contains(event.target)) {
        setShowGradesDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const { handleLogout } = useAuthActions();


  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src={logo} alt="clearSKY logo" className="navbar-img-logo" />
        <button className="navbar-link" onClick={() => navigate('/instructor/dashboard')}>
          My Dashboard
          </button>
        <button className="navbar-link" onClick={() => navigate('/instructor/courses')}>
          My Courses
        </button>
        <button className="navbar-link" onClick={() => navigate('/instructor/notifications')}>
          Notifications
          </button>
        <div className="navbar-grades-wrapper" ref={gradesDropdownRef}>
          <button className="navbar-link navbar-grades-btn" onClick={() => setShowGradesDropdown(v => !v)}>
            Post Grades
          </button>
          {showGradesDropdown && (
            <div className="navbar-grades-dropdown">
              <button className="navbar-grades-dropdown-btn" onClick={() => navigate('/instructor/grades/initial')}>
                Post initial grades
              </button>
              <button className="navbar-grades-dropdown-btn" onClick={() => navigate('/instructor/grades/final')}>
                Post final grades
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="navbar-right">
        <div className="navbar-profile-wrapper" ref={profileDropdownRef}>
          <button className="navbar-link navbar-profile-btn" onClick={() => setShowProfileDropdown(v => !v)}>
            Instructor's Name
          </button>
          {showProfileDropdown && (
            <div className="navbar-profile-dropdown">
              <button className="navbar-profile-dropdown-btn">Profile</button>
              <button className="navbar-profile-dropdown-btn" onClick={handleLogout}>Logout</button>
            </div>
          )}
        </div>
        <div className="navbar-profile-pic">
          {/* Εδώ μπορεί να μπει εικόνα προφίλ */}
          <img src="https://www.gravatar.com/avatar/?d=mp" alt="profile" />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;