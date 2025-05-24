import { useState, useEffect } from 'react';
import { getCreditBalance, getCreditHistory } from '../api/credits';
import { useAuth } from '../auth/AuthContext';

export const useCredits = () => {
  const { user } = useAuth();
  const [balance, setBalance] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.institution_id) {
      console.warn('❗ No institution_id in user:', user);
      setError('Missing institution ID');
      setLoading(false);
      return;
    }

    const load = async () => {
      setLoading(true);
      try {
        console.log('➡️ Fetching credits for institution:', user.institution_id);
        const [b, h] = await Promise.all([
          getCreditBalance(user.institution_id),
          getCreditHistory(user.institution_id),
        ]);
        console.log('✅ Balance result:', b);
        console.log('📜 History result:', h);
        setBalance(b.credits_balance);
        setHistory(h);
      } catch (err) {
        console.error('❌ Error fetching credits:', err);
        setError(err?.message || 'Failed to load credits');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user]);

  return { balance, history, loading, error };
};
