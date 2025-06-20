import { useEffect, useState } from 'react';
import { getReviewRequestsForStudent } from '../api/reviews';

export const useStudentReviews = (studentId) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!studentId) return;

    const fetch = async () => {
      try {
        const data = await getReviewRequestsForStudent(studentId);
        setReviews(data);
      } catch (err) {
        console.error('❌ Failed to fetch student review requests:', err);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [studentId]);

  return { reviews, loading };
};
