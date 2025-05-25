import { useState, useEffect } from 'react';
import { fetchGradesByStudentId } from '../api/grades';
import { useAuth } from '../auth/AuthContext';

const useStudentGrades = () => {
  const { user } = useAuth();
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.id) return;

    const load = async () => {
      try {
        const data = await fetchGradesByStudentId(user.id);
        setGrades(data);
      } catch (err) {
        setError(err.message || 'Error fetching grades');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user]);

  return { grades, loading, error };
};

export default useStudentGrades;
