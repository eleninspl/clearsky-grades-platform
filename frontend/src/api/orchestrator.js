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

// 📚 Institutions API
export const fetchAllInstitutions = async () => {
  const res = await orchestratorAPI.get('/institutions');
  return res.data;
};

export const fetchInstitutionById = async (id) => {
  const res = await orchestratorAPI.get(`/institutions/${id}`);
  return res.data;
};

export const createInstitution = async (institution) => {
  const res = await orchestratorAPI.post('/institutions', institution);
  return res.data;
};

export const updateInstitution = async (id, institution) => {
  const res = await orchestratorAPI.put(`/institutions/${id}`, institution);
  return res.data;
};

export const deleteInstitution = async (id) => {
  const res = await orchestratorAPI.delete(`/institutions/${id}`);
  return res.data;
};

export const patchInstitutionCredits = async (id, delta) => {
  const res = await orchestratorAPI.patch(`/institutions/${id}/credits`, { delta });
  return res.data;
};

// 📊 Institution Stats
export const getInstitutionStats = async () => {
  const res = await orchestratorAPI.get('/institutions/stats');
  return res.data;
};

export const getInstitutionCourseList = async () => {
  const res = await orchestratorAPI.get('/institutions/stats/course-list');
  return res.data;
};

export const createReviewRequest = async (reviewData) => {
  const res = await orchestratorAPI.post('/review/requests', reviewData);
  return res.data;
};

export const getReviewRequestsByInstructor = async (instructorId) => {
  const res = await orchestratorAPI.get('/review/instructor', {
    params: { instructorId },
  });
  return res.data;
};

export const submitReviewResponse = async (responseData) => {
  const res = await orchestratorAPI.post('/review/responses', responseData);
  return res.data;
};

export const getReviewStatusForStudent = async (userId, courseId) => {
  const res = await orchestratorAPI.get('/review/status', {
    params: { user_id: userId, course_id: courseId },
  });
  return res.data;
};
