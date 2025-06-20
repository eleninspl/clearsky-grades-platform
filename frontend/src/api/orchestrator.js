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



export const login = async (email, password) => {
  const res = await orchestratorAPI.post('/auth/login', { email, password });
  return res.data; // { token, user }
};

export const signup = async (email, password, fullName) => {
  const res = await orchestratorAPI.post('/auth/signup', {
    email,
    password,
    fullName,
  });
  return res.data;
};

export const logout = async () => {
  const res = await orchestratorAPI.post('/auth/logout');
  return res.data;
};

export const startGoogleLogin = () => {
  window.location.href = `${process.env.REACT_APP_API_URL}/auth/google`;
};

export const createUserByRole = async ({ email, username, password, role, id }) => {
  const res = await orchestratorAPI.post('/auth/users', {
    email,
    username,
    password,
    role,
    id,
  });
  return res.data;
};
