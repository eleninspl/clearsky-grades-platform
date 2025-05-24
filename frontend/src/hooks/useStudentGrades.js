import { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthContext';
import { getStudentGrades } from '../api/grades';

export const useStudentGrades = () => {
  const { user } = useAuth();
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.id) return;

    const fetchGrades = async () => {
      setLoading(true);
      try {
        const data = await getStudentGrades(user.id);
        setGrades(data);
      } catch (err) {
        console.error('Error loading student grades:', err);
        setError('Failed to load student grades');
      } finally {
        setLoading(false);
      }
    };

    fetchGrades();
  }, [user]);

  return { grades, loading, error };
};
