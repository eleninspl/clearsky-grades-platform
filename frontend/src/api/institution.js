import { orchestratorAPI } from '../utils/axiosInstance';

// 📊 Institution Stats
export const getInstitutionStats = async () => {
  const res = await orchestratorAPI.get('/institutions/stats');
  return res.data;
};

export const getInstitutionCourseList = async () => {
  const res = await orchestratorAPI.get('/institutions/stats/course-list');
  return res.data;
};
