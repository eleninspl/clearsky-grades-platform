import { reviewAPI } from '../utils/axiosInstance';

// Υποβολή νέου αιτήματος αναβαθμολόγησης
export const submitReviewRequest = async ({ grade_id, user_id, message }) => {
  const res = await reviewAPI.post('/requests', {
    grade_id,
    user_id,
    message
  });
  return res.data;
};
