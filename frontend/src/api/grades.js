import { gradesAPI } from '../utils/axiosInstance';

export const getStudentGrades = async (studentId) => {
  const res = await gradesAPI.get(`/grades/student/${studentId}`);
  return res.data; // π.χ. [{ grade, type, course_code, course_title }]
};
