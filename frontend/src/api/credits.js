import { orchestratorAPI } from '../utils/axiosInstance';

// Λήψη υπολοίπου credits για institution
export const getCreditsBalance = async (institutionId) => {
  const res = await orchestratorAPI.get(`/credits/${institutionId}/balance`);
  return res.data;
};

// Αγορά credits για institution
export const buyCredits = async (institutionId, amount) => {
  const res = await orchestratorAPI.post(`/credits/${institutionId}/buy`, {
    amount,
  });
  return res.data;
};

// Ιστορικό συναλλαγών
export const getCreditHistory = async (institutionId) => {
  const res = await orchestratorAPI.get(`/credits/${institutionId}/history`);
  return res.data;
};
