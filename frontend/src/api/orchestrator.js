import { orchestratorAPI } from '../utils/axiosInstance';

export const fetchStudentGrades = async (studentId) => {
    const res = await orchestratorAPI.get(`/grades/student/${studentId}`);
    return res.data;
  };
  