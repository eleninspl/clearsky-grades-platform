import { orchestratorAPI } from '../utils/axiosInstance';

export const fetchStudentDashboard = async () => {
  const res = await orchestratorAPI.get('/student-dashboard');
  return res.data;
};
