import { useState } from 'react';
import { login as apiLogin, logout as apiLogout } from '../api/auth'; 
import { useAuth } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';

export function useAuthActions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { login: contextLogin, logout: contextLogout } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const { token, user } = await apiLogin(email, password);
      localStorage.setItem('token', token);
      contextLogin(user);
      navigate('/redirect', { replace: true });
    } catch (err) {
      const msg = err.response?.data?.error || 'Login failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await apiLogout(); 
    } catch (err) {
      console.warn('Logout API failed, continuing locally');
    }
    contextLogout();
    navigate('/login', { replace: true });
  };

  return { handleLogin, handleLogout, loading, error };
}
