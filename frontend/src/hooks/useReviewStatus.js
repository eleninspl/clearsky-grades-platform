import { useState, useEffect } from 'react';
import { getReviewStatusForStudent } from '../api/orchestrator';

export const useReviewStatus = (userId, courseId) => {
  const [status, setStatus] = useState(null);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId || !courseId) return;

    const fetchStatus = async () => {
      setLoading(true);
      try {
        const data = await getReviewStatusForStudent(userId, courseId);
        setStatus(data.status);
        setResponse(data.instructor_response);
      } catch (err) {
        if (err.response?.status === 404) {
          setStatus('NOT_SUBMITTED');
          setResponse(null);
        } else {
          setError(err.message || 'Error fetching review status');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, [userId, courseId]);

  return { status, response, loading, error };
};
