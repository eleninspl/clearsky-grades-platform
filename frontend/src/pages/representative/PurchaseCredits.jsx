import React, { useState } from 'react';
import RepNavbar from './RepNavbar.jsx'; // adjust if needed
import './AddUser.css'; // reuse styling

function PurchaseCredits() {
  const [credits, setCredits] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement purchase logic
    setMessage(`Requested to purchase ${credits} credits.`);
  };

  return (
    <div className="adduser-container">
      <RepNavbar />
      <main className="adduser-main">
        
        <section className="adduser-section">
          <div className="adduser-title">Buy credits</div>
          <form className="adduser-form" onSubmit={handleSubmit}>
            <div className="adduser-form-row">
              <label>Amount</label>
              <input
                type="number"
                min="1"
                className="adduser-input"
                value={credits}
                onChange={(e) => setCredits(e.target.value)}
                placeholder="Enter amount"
              />
            </div>
            <div className="adduser-btn-row">
              <button type="submit" className="adduser-btn">Submit</button>
            </div>
          </form>
        </section>

        <section className="adduser-section">
          <div className="adduser-title">Message area</div>
          <div className="adduser-message-content">
            {message}
          </div>
        </section>

      </main>
    </div>
  );
}

export default PurchaseCredits;
