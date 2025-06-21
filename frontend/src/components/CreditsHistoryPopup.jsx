import React, { useEffect, useState } from 'react';
import './CreditsHistoryPopup.css';
import { getCreditHistory } from '../api/credits'; 

function CreditsHistoryPopup({ onClose }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const institutionId = user?.institution_id;

        if (!institutionId) throw new Error('No institution ID found');

        const result = await getCreditHistory(institutionId);
        setTransactions(result);
      } catch (err) {
        console.error('❌ Error fetching history:', err);
        setError(err.message || 'Failed to fetch history');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="history-popup-overlay">
      <div className="history-popup-modal">
        <button className="history-popup-close" onClick={onClose}>×</button>
        <h3>Usage History</h3>

        {loading && <p>Loading history...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {!loading && !error && transactions.length === 0 && (
          <p>No history found.</p>
        )}

        {!loading && !error && transactions.length > 0 && (
          <ul className="history-list">
            {transactions.map((tx, index) => (
              <li key={tx.id || index}>
                <strong>{tx.description}</strong><br />
                <small>{new Date(tx.created_at).toLocaleString()}</small>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default CreditsHistoryPopup;
