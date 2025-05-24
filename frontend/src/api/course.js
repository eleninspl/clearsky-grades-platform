import { courseAPI } from '../utils/axiosInstance';

export const fetchCourses = async () => {
  const res = await courseAPI.get('/');
  return res.data;
};

export const fetchCourseById = async (id) => {
  const res = await courseAPI.get(`/${id}`);
  return res.data;
};

export const createCourse = async (courseData) => {
  const res = await courseAPI.post('/', courseData);
  return res.data;
};

export const updateCourse = async (id, updatedFields) => {
  const res = await courseAPI.put(`/${id}`, updatedFields);
  return res.data;
};

export const deleteCourse = async (id) => {
  const res = await courseAPI.delete(`/${id}`);
  return res.data;
};
