import { useState, useEffect } from 'react';
import { fetchCoursesByStudentId } from '../api/course';
import { useAuth } from '../auth/AuthContext';

export const useStudentCourses = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.am) return;

    const loadCourses = async () => {
      setLoading(true);
      try {
        const data = await fetchCoursesByStudentId(user.id);
        setCourses(data);
      } catch (err) {
        console.error('❌ Failed to load courses:', err);
        setError('Could not load courses.');
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, [user?.am]);

  return { courses, loading, error };
};
