import { orchestratorAPI } from '../utils/axiosInstance';

// 📚 Grades
export const fetchStudentGrades = async (studentId) => (await orchestratorAPI.get(`/grades/student/${studentId}`)).data;
export const fetchInstructorCourses = async (instructorId) => (await orchestratorAPI.get(`/grades/instructor/${instructorId}/courses`)).data;

// 📤 Upload
export const uploadGradesFile = async (file, type) => {
  const formData = new FormData(); formData.append('file', file);
  try {
    return (await orchestratorAPI.post(`/grades/${type}`, formData)).data;
  } catch (err) {
    throw err.response?.data || new Error('Failed to upload file');
  }
};

// 📊 Statistics
export const getDistribution = async (courseId, type = 'INITIAL') => (await orchestratorAPI.get(`/grades/distribution/${courseId}/${type}`)).data;
export const getQuestionKeys = async (courseId, type = 'INITIAL') => (await orchestratorAPI.get(`/grades/questions/${courseId}/${type}`)).data;
export const getQuestionDistribution = async (courseId, question, type = 'INITIAL') =>
  (await orchestratorAPI.get(`/grades/distribution/${courseId}/${type}/q/${question}`)).data;
