import { useState, useEffect } from 'react';
import { getReviewStatusForStudent } from '../api/reviews';

export const useReviewStatus = (userId, courseId) => {
  const [status, setStatus] = useState(null);
  const [response, setResponse] = useState(null);
  const [studentMessage, setStudentMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId || !courseId) return;

    const fetchStatus = async () => {
      setLoading(true);
      try {
        const reviewData = await getReviewStatusForStudent(userId, courseId);
        setStatus(reviewData.status);
        setResponse(reviewData.instructor_response);
        setStudentMessage(reviewData.student_message);
      } catch (err) {
        if (err.response?.status === 404) {
          setStatus('NOT_SUBMITTED');
          setResponse(null);
          setStudentMessage('');
        } else {
          setError(err.message || 'Error fetching review status');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, [userId, courseId]);

  return {
    status,
    response,
    studentMessage,
    loading,
    error,
  };
};
