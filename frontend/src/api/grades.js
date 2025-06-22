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

  try {
    const res = await orchestratorAPI.post(`/grades/${type}`, formData);
    return res.data;
  } catch (err) {
    // ✅ Προωθούμε το πραγματικό backend error στον caller
    const backendError = err.response?.data;
    throw backendError || new Error('Failed to upload file');
  }
};


export const getDistribution = async (courseId, type = 'INITIAL') => {
  const res = await orchestratorAPI.get(`/grades/distribution/${courseId}/${type}`);
  return res.data;
};

export const getQuestionKeys = async (courseId, type = 'INITIAL') => {
  const res = await orchestratorAPI.get(`/grades/questions/${courseId}/${type}`);
  return res.data;
};

export const getQuestionDistribution = async (courseId, question, type = 'INITIAL') => {
  const res = await orchestratorAPI.get(`/grades/distribution/${courseId}/${type}/q/${question}`);
  return res.data;
};
