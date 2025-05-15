import React from 'react';
import './LogoBar.css';
import logo from './assets/clearSKY-logo.png';

function LogoBar() {
  return (
    <div className="logo-bar">
      <img src={logo} alt="clearSKY logo" className="navbar-img-logo" />
    </div>
  );
}

export default LogoBar; 