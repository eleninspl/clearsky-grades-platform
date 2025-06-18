import React, { useState } from 'react';
import './RepCredits.css';
import RepNavbar from './RepNavbar.jsx';
import { useCredits } from '../../hooks/useCredits';
import { buyCredits } from '../../api/credits';

function RepCredits() {
  const { balance, history, loading, error, reload } = useCredits();

  const [showModal, setShowModal] = useState(false); // ✅ Popup control
  const [creditsToBuy, setCreditsToBuy] = useState(''); // ✅ Credit input

  const used = history
    .filter(tx => tx.tx_type === 'CONSUME')
    .reduce((acc, tx) => acc + Math.abs(tx.amount), 0);

  const safeBalance = typeof balance === 'number' ? balance : 0;
  const total = safeBalance + used;
  const remaining = safeBalance;

  const handlePurchase = async () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    const institutionId = user?.institution_id;

    if (!institutionId || !creditsToBuy || Number(creditsToBuy) <= 0) {
      alert('Enter a valid amount');
      return;
    }

    const result = await buyCredits(institutionId, Number(creditsToBuy));
    console.log('✅ Buy result:', result);

    await reload();
    setShowModal(false);
    setCreditsToBuy('');
  } catch (err) {
    console.error('❌ Buy credits failed:', err?.response?.data || err.message || err);
    alert('Failed to buy credits');
  }
};



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
            <button className="rep-credits-btn" onClick={() => setShowModal(true)}>
              Purchase Credits
            </button>
            <button className="rep-credits-btn">View Usage History</button>
          </div>
        </div>
      </main>

      {/* ✅ Popup */}
      {showModal && (
        <div className="popup-overlay">
          <div className="popup-modal">
            <h3>Buy Credits</h3>
            <input
              type="number"
              min="1"
              className="adduser-input"
              value={creditsToBuy}
              onChange={(e) => setCreditsToBuy(e.target.value)}
              placeholder="Enter amount"
            />
            <div className="adduser-btn-row">
              <button className="adduser-btn" onClick={handlePurchase}>Submit</button>
              <button className="adduser-btn" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RepCredits;
