import { orchestratorAPI } from '../utils/axiosInstance';

// ── Get current credit balance ──
export const getCreditsBalance = async (institutionId) => {
  const res = await orchestratorAPI.get(`/credits/${institutionId}/balance`);
  return res.data;
};

// ── Purchase credits ─────────────
export const buyCredits = async (institutionId, amount) => {
  const res = await orchestratorAPI.post(`/credits/${institutionId}/buy`, { amount });
  return res.data;
};

// ── Fetch credit transaction history ──
export const getCreditHistory = async (institutionId) => {
  const res = await orchestratorAPI.get(`/credits/${institutionId}/history`);
  return res.data;
};
