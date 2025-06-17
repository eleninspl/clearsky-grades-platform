import React from 'react';
import './RepCredits.css';
import RepNavbar from './RepNavbar.jsx';
import { useCredits } from '../../hooks/useCredits';
import { useNavigate } from 'react-router-dom'; // ✅ added

function RepCredits() {
  const navigate = useNavigate(); // ✅ added

  const { balance, history, loading, error } = useCredits();

  const used = history
    .filter(tx => tx.tx_type === 'CONSUME')
    .reduce((acc, tx) => acc + Math.abs(tx.amount), 0);

  const safeBalance = typeof balance === 'number' ? balance : 0;
  const total = safeBalance + used;
  const remaining = safeBalance;

  return (
    <div className="rep-credits-container">
      <RepNavbar />
      <main className="rep-credits-main">
        <div className="rep-credits-section">
          <h2 className="rep-credits-title">Credits Management</h2>

          {loading && <p>Loading credits...</p>}
          {error && <p className="rep-credits-error">{error}</p>}

          {!loading && !error && (
            <div className="rep-credits-grid">
              <div className="rep-credits-card">
                <h3>Total Credits</h3>
                <div className="rep-credits-value">{total}</div>
                <div className="rep-credits-description">Available credits for the institution</div>
              </div>
              <div className="rep-credits-card">
                <h3>Used Credits</h3>
                <div className="rep-credits-value">{used}</div>
                <div className="rep-credits-description">Credits used in current period</div>
              </div>
              <div className="rep-credits-card">
                <h3>Remaining Credits</h3>
                <div className="rep-credits-value">{remaining}</div>
                <div className="rep-credits-description">Credits available for use</div>
              </div>
            </div>
          )}

          <div className="rep-credits-actions">
            <button
              className="rep-credits-btn"
              onClick={() => navigate('/representative/purchase-credits')} // ✅ correct route
            >
              Purchase Credits
            </button>
            <button className="rep-credits-btn">View Usage History</button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default RepCredits;
