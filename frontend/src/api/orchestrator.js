import { orchestratorAPI } from '../utils/axiosInstance';

export const fetchStudentGrades = async (studentId) => {
    const res = await orchestratorAPI.get(`/grades/student/${studentId}`);
    return res.data;
  };
  
  export const fetchInstructorCourses = async (instructorId) => {
    const res = await orchestratorAPI.get(`/grades/instructor/${instructorId}/courses`);
    return res.data;
  };