import { creditsAPI } from '../utils/axiosInstance';

export const getCreditBalance = async (institutionId) => {
  const res = await creditsAPI.get(`/${institutionId}`);
  return res.data; // { credits_balance: number }
};

export const buyCredits = async (institutionId, amount) => {
  const res = await creditsAPI.post(`/${institutionId}/buy`, { amount });
  return res.data; // { message, new_balance }
};

export const consumeCredit = async (institutionId) => {
  const res = await creditsAPI.post(`/${institutionId}/use`);
  return res.data; // { message, remaining }
};

export const getCreditHistory = async (institutionId) => {
  const res = await creditsAPI.get(`/${institutionId}/history`);
  return res.data; // [{ tx_type, amount, created_at }, ...]
};
