import React, { useState, useRef, useEffect } from 'react';
import './Navbar.css';
import { Link, useNavigate } from 'react-router-dom';
import logo from './assets/clearSKY-logo.png';

function Navbar() {
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

  const handleLogout = () => {
    setShowProfileDropdown(false);
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src={logo} alt="clearSKY logo" className="navbar-img-logo" />
        <Link to="/course-statistics" className="navbar-link">My Courses</Link>
        <Link to="/notifications" className="navbar-link">Notifications</Link>
        <div className="navbar-grades-wrapper" ref={gradesDropdownRef}>
          <button className="navbar-link navbar-grades-btn" onClick={() => setShowGradesDropdown(v => !v)}>
            Post Grades
          </button>
          {showGradesDropdown && (
            <div className="navbar-grades-dropdown">
              <Link to="/post-initial-grades" className="navbar-grades-dropdown-btn" onClick={() => setShowGradesDropdown(false)}>
                Post initial grades
              </Link>
              <Link to="/post-final-grades" className="navbar-grades-dropdown-btn" onClick={() => setShowGradesDropdown(false)}>
                Post final grades
              </Link>
            </div>
          )}
        </div>
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
          {/* Εδώ μπορεί να μπει εικόνα προφίλ */}
          <img src="https://www.gravatar.com/avatar/?d=mp" alt="profile" />
        </div>
      </div>
    </nav>
  );
}

export default Navbar; 