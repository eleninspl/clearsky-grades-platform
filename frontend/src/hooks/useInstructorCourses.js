import { useState, useEffect } from 'react';
import { fetchCoursesByInstructorId } from '../api/course';
import { useAuth } from '../auth/AuthContext';

export const useInstructorCourses = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.id) return;

    const loadCourses = async () => {
      setLoading(true);
      try {
        const data = await fetchCoursesByInstructorId(user.id);
        setCourses(data);
      } catch (err) {
        console.error('❌ Failed to load instructor courses:', err);
        setError('Could not load instructor courses.');
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, [user?.id]);

  return { courses, loading, error };
};
