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
  
    const res = await orchestratorAPI.post(`/grades/${type}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  
    return res.data;
  };
  