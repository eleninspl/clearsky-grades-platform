import { institutionAPI } from '../utils/axiosInstance';

export const getAllInstitutions = async () => {
  const res = await institutionAPI.get('/');
  return res.data;      // [ { id, name, email, credits_balance, ... }, ... ]
};

export const getInstitutionById = async (id) => {
  const res = await institutionAPI.get(`/${id}`);
  return res.data;     // { id, name, email, ... }
};

export const createInstitution = async ({ name, email }) => {
  const res = await institutionAPI.post('/', { name, email });
  return res.data;         // newly-created institution row
};

export const updateInstitution = async (id, { name, email }) => {
  const res = await institutionAPI.put(`/${id}`, { name, email });
  return res.data;        // updated row
};

export const deleteInstitution = async (id) => {
  const res = await institutionAPI.delete(`/${id}`);
  return res.data;       // { message, institution }
};

export const getInstitutionStats = async () => {
  const res = await institutionAPI.get('/stats');
  return res.data;     // { students, instructors, active_courses }
};

export const getInstitutionAverageGrade = async () => {
  const { data } = await institutionAPI.get('/stats/average-grade');
  return data.average_grade;            // returns numeric average grade 
};

export const getInstitutionGradeDistribution = async () => {
  const { data } = await institutionAPI.get('/stats/grade-distribution');
  return data.distribution;             // returns array of { bucket: number, count: number }
};

export const getInstitutionCourseEnrollment = async () => {
  const { data } = await institutionAPI.get('/stats/course-enrollment');
  return data.enrollment;           // returns array of { courseId: number, title: string, enrolled: number }
};
