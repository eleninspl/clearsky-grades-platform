import axios from 'axios';

// Helper function για να δημιουργούμε axios instances με token
const createAxiosInstance = (baseURL) => {
  const instance = axios.create({ baseURL });

  // ➕ Attach token
  instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // ➕ Auto logout on 401
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        console.warn('🔒 Token expired or unauthorized. Logging out...');

        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }

      return Promise.reject(error);
    }
  );

  return instance;
};

// Δημιουργούμε instances για κάθε service
export const authAPI = createAxiosInstance(import.meta.env.VITE_AUTH_API_URL);
export const userAPI = createAxiosInstance(import.meta.env.VITE_USER_API_URL);
export const institutionAPI = createAxiosInstance(import.meta.env.VITE_INSTITUTION_API_URL);
export const gradesAPI = createAxiosInstance(import.meta.env.VITE_GRADES_API_URL);

export const reviewAPI = createAxiosInstance(import.meta.env.VITE_REVIEW_API_URL);

export const creditsAPI = createAxiosInstance(import.meta.env.VITE_CREDITS_API_URL);

export const orchestratorAPI = createAxiosInstance(import.meta.env.VITE_ORCHESTRATOR_API_URL);

