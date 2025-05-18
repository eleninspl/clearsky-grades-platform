import React from 'react';
import './RepCredits.css';
import RepNavbar from './RepNavbar.jsx';

function RepCredits({ setCurrentComponent }) {
  return (
    <div className="rep-credits-container">
      <RepNavbar setCurrentComponent={setCurrentComponent} />
      <main className="rep-credits-main">
        <div className="rep-credits-section">
          <h2 className="rep-credits-title">Credits Management</h2>
          <div className="rep-credits-grid">
            <div className="rep-credits-card">
              <h3>Total Credits</h3>
              <div className="rep-credits-value">5,000</div>
              <div className="rep-credits-description">Available credits for the institution</div>
            </div>
            <div className="rep-credits-card">
              <h3>Used Credits</h3>
              <div className="rep-credits-value">2,345</div>
              <div className="rep-credits-description">Credits used in current period</div>
            </div>
            <div className="rep-credits-card">
              <h3>Remaining Credits</h3>
              <div className="rep-credits-value">2,655</div>
              <div className="rep-credits-description">Credits available for use</div>
            </div>
          </div>
          <div className="rep-credits-actions">
            <button className="rep-credits-btn">Purchase Credits</button>
            <button className="rep-credits-btn">View Usage History</button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default RepCredits; 