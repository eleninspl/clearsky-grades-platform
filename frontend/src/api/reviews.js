import { orchestratorAPI } from '../utils/axiosInstance';

export const getReviewRequestsByInstructor = async (instructorId) => {
  const res = await orchestratorAPI.get('/review/instructor', {
    params: { instructorId },
  });
  return res.data;
};

export const getReviewStatusForStudent = async (userId, courseId) => {
  const res = await orchestratorAPI.get('/review/status', {
    params: { user_id: userId, course_id: courseId },
  });
  return res.data;
};

export const getReviewRequestsForStudent = async (studentId) => {
  const res = await orchestratorAPI.get(`/review/requests/student/${studentId}`);
  return res.data;
};

export const submitReviewResponse = async (responseData) => {
  const res = await orchestratorAPI.post('/review/responses', responseData);
  return res.data;
};

export const createReviewRequest = async (reviewData) => {
  const res = await orchestratorAPI.post('/review/requests', reviewData);
  return res.data;
};