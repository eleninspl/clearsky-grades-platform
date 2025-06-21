import { useState, useEffect } from 'react';
import { getCreditsBalance, getCreditHistory } from '../api/credits'; // updated import
import { useAuth } from '../auth/AuthContext';

export const useCredits = () => {
  const { user } = useAuth();
  const [balance, setBalance] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    if (!user?.institution_id) return;

    setLoading(true);
    setError(null);

    try {
      const [balanceData, historyData] = await Promise.all([
        getCreditsBalance(user.institution_id), // updated function
        getCreditHistory(user.institution_id),  // updated function
      ]);
      setBalance(balanceData.balance); // παραμένει σωστό
      setHistory(historyData);
    } catch (err) {
      setError(err?.response?.data?.error || err.message || 'Failed to fetch credits');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [user?.institution_id]);

  return {
    balance,
    history,
    loading,
    error,
    reload: load,
  };
};
