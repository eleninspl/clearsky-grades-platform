import { orchestratorAPI } from '../utils/axiosInstance';

export const fetchStudentGrades = async (studentId) => {
  const res = await orchestratorAPI.get(`/grades/student/${studentId}`);
  return res.data;
};

export const fetchInstructorCourses = async (instructorId) => {
  const res = await orchestratorAPI.get(`/grades/instructor/${instructorId}/courses`);
  return res.data;
};

export const uploadGradesFile = async (file, type) => {
  const formData = new FormData();
  formData.append('file', file);
  const res = await orchestratorAPI.post(`/grades/${type}`, formData);
  return res.data;
};

export const getDistribution = async (courseId) => {
  const res = await orchestratorAPI.get(`/grades/distribution/${courseId}`);
  return res.data;
};

export const getQuestionKeys = async (courseId) => {
  const res = await orchestratorAPI.get(`/grades/questions/${courseId}`);
  return res.data;
};

export const getQuestionDistribution = async (courseId, question) => {
  const res = await orchestratorAPI.get(`/grades/distribution/${courseId}/q/${question}`);
  return res.data;
};
