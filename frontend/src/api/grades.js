import { gradesAPI } from '../utils/axiosInstance';

export const fetchGradesByStudentId = async (id) => {
  const res = await gradesAPI.get(`/student/${id}`);
  return res.data;
};
