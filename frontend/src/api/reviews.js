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

// Φέρνει όλα τα review requests για συγκεκριμένο instructor
export const fetchReviewRequestsByInstructor = async (instructorId) => {
  const res = await reviewAPI.get(`/?instructorId=${instructorId}`);
  return res.data;
};

// Υποβολή απάντησης instructor σε review request

export const submitReviewResponse = async ({ review_request_id, responder_id, message, final_grade }) => {
  if (!review_request_id || !responder_id || !message) {
    throw new Error('Missing required fields for response');
  }

  const payload = {
    review_request_id,
    responder_id,
    message,
    final_grade: final_grade || null  // fallback σε null αν undefined
  };

  const res = await reviewAPI.post('/responses', payload);
  return res.data;
};