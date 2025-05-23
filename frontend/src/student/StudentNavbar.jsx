import React, { useState, useRef, useEffect } from 'react';
import './StudentNavbar.css';
import logo from '../assets/clearSKY-logo.png';

function StudentNavbar({ setCurrentComponent }) {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const profileDropdownRef = useRef(null);

  // Κλείσιμο dropdown όταν κάνεις click εκτός
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
    setCurrentComponent('Login');
  };

  return (
    <nav className="student-navbar">
      <div className="student-navbar-left">
        <img src={logo} alt="clearSKY logo" className="student-navbar-img-logo" />
        <button className="student-navbar-link" onClick={() => setCurrentComponent('StudentCourses')}>My Courses</button>
        <button className="student-navbar-link" onClick={() => setCurrentComponent('StudentGrades')}>My Grades</button>
      </div>
      <div className="student-navbar-right">
        <div className="student-navbar-profile-wrapper" ref={profileDropdownRef}>
          <button className="student-navbar-link student-navbar-profile-btn" onClick={() => setShowProfileDropdown(v => !v)}>
            Profile
          </button>
          {showProfileDropdown && (
            <div className="student-navbar-profile-dropdown">
              <button className="student-navbar-profile-dropdown-btn">Profile</button>
              <button className="student-navbar-profile-dropdown-btn" onClick={handleLogout}>Logout</button>
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