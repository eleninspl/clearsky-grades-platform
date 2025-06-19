import { useEffect, useState } from 'react';
import { getDistribution, getQuestionDistribution, getQuestionKeys } from '../api/orchestrator';

export const useCourseStatistics = (courseId) => {
  const [statistics, setStatistics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!courseId) return;

    const fetchStats = async () => {
      setLoading(true);
      try {
        const total = await getDistribution(courseId);
        const keys = await getQuestionKeys(courseId);

        const questions = await Promise.all(
          keys.map(q =>
            getQuestionDistribution(courseId, q).then(data => ({ label: q, data }))
          )
        );


        const full = [
          {
            label: 'total',
            data: total.map(d => ({ label: d.grade.toString(), value: d.count }))
          },
          ...questions.map(q => ({
            label: q.label,
            data: q.data.map(d => ({ label: d.grade.toString(), value: d.count }))
          }))
        ];

        setStatistics(full);
      } catch (err) {
        console.error('❌ Failed to load distributions:', err);
        setError('Failed to fetch statistics');
        setStatistics([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [courseId]);

  return { statistics, loading, error };
};
