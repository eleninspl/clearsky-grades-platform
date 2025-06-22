import { orchestratorAPI } from '../utils/axiosInstance';

export const login = async (email, password) => {
  const res = await orchestratorAPI.post('/auth/login', { email, password });
  return res.data;
};

export const logout = async () => {
  const res = await orchestratorAPI.post('/auth/logout');
  return res.data;
};

export const startGoogleLogin = () => {
  window.location.href = `${process.env.REACT_APP_API_URL}/auth/google`;
};

export const createUserByRole = async ({ email, username, password, role, id }) => {
  const res = await orchestratorAPI.post('/auth/users', {
    email,
    username,
    password,
    role,
    id,
  });
  return res.data;
};
