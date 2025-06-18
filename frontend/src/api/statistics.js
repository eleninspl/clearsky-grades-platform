import { statisticsAPI } from '../utils/axiosInstance';

export const getDistribution = async (courseId) => {
  const res = await statisticsAPI.get(`/distribution/${courseId}`);
  return res.data;
};

export const getQuestionDistribution = async (courseId, question) => {
  const res = await statisticsAPI.get(`/distribution/${courseId}/q/${question}`);
  return res.data;
};

export const getQuestionKeys = async (courseId) => {
  const res = await statisticsAPI.get(`/questions/${courseId}`);
  return res.data;
};
