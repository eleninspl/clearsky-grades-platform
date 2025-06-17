import { authAPI } from '../utils/axiosInstance';

export const loginUser = async (email, password) => {
  const res = await authAPI.post('/login', { email, password });
  return res.data; // { token, user }
};

export const signupUser = async ({ email, password, fullName }) => {
  const res = await authAPI.post('/signup', { email, password, fullName });
  return res.data; // { token }
};

export const createUserByRole = async ({ username, email, password, role, id }) => {
  const res = await authAPI.post('/users', {
    username,
    email,
    password,
    role,
    id: role === 'STUDENT' ? id : undefined // ✅ only for students
  });
  return res.status;
};


