import { orchestratorAPI } from '../utils/axiosInstance';

export const fetchAllInstitutions = async () => {
  const res = await orchestratorAPI.get('/institutions');
  return res.data;
};

export const fetchInstitutionById = async (id) => {
  const res = await orchestratorAPI.get(`/institutions/${id}`);
  return res.data;
};

export const createInstitution = async (institution) => {
  const res = await orchestratorAPI.post('/institutions', institution);
  return res.data;
};

export const updateInstitution = async (id, institution) => {
  const res = await orchestratorAPI.put(`/institutions/${id}`, institution);
  return res.data;
};

export const deleteInstitution = async (id) => {
  const res = await orchestratorAPI.delete(`/institutions/${id}`);
  return res.data;
};

export const patchInstitutionCredits = async (id, delta) => {
  const res = await orchestratorAPI.patch(`/institutions/${id}/credits`, { delta });
  return res.data;
};

// 📊 Institution Stats
export const getInstitutionStats = async () => {
  const res = await orchestratorAPI.get('/institutions/stats');
  return res.data;
};

export const getInstitutionCourseList = async () => {
  const res = await orchestratorAPI.get('/institutions/stats/course-list');
  return res.data;
};
