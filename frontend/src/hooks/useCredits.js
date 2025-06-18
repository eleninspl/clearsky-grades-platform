import { useState, useEffect } from 'react';
import { getCreditBalance, getCreditHistory } from '../api/credits';
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
    try {
      const [b, h] = await Promise.all([
        getCreditBalance(user.institution_id),
        getCreditHistory(user.institution_id),
      ]);
      setBalance(b.credits_balance);
      setHistory(h);
    } catch (err) {
      setError(err?.message || 'Failed to fetch credits');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [user]);

  return { balance, history, loading, error, reload: load }; // ✅ added reload
};
