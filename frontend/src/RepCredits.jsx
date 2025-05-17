import React, { useState } from 'react';
import RepNavbar from './RepNavbar.jsx';
import './RepCredits.css';

function RepCredits() {
  const [credits, setCredits] = useState(1);

  return (
    <div className="rep-credits-container">
      <RepNavbar />
      <main className="rep-credits-main">
        <section className="rep-credits-section">
          <div className="rep-credits-title">Buy Credits</div>
          <div className="rep-credits-form-row">
            <label htmlFor="credits-input">Number of credits:</label>
            <input
              id="credits-input"
              type="number"
              min="1"
              value={credits}
              onChange={e => setCredits(Math.max(1, parseInt(e.target.value) || 1))}
              className="rep-credits-input"
            />
          </div>
          <button className="rep-credits-buy-btn">Buy</button>
        </section>
      </main>
    </div>
  );
}

export default RepCredits; 