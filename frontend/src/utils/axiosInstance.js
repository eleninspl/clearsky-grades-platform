import axios from 'axios';

// ✅ Δυναμικό backend URL βασισμένο στο hostname του browser
const backendHost = window.location.hostname;
const backendPort = '5010';
const dynamicOrchestratorURL = `http://${backendHost}:${backendPort}`;

console.log("🌐 Using orchestrator at", dynamicOrchestratorURL);

const createAxiosInstance = (baseURL) => {
  const instance = axios.create({
    baseURL,
    withCredentials: true
  });

  instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

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

// ✅ Όλα τα instances μιλάνε με τον orchestrator
export const orchestratorAPI = createAxiosInstance(dynamicOrchestratorURL);
export const authAPI = createAxiosInstance(dynamicOrchestratorURL);
export const creditsAPI = createAxiosInstance(dynamicOrchestratorURL);
export const reviewAPI = createAxiosInstance(dynamicOrchestratorURL);
export const gradesAPI = createAxiosInstance(dynamicOrchestratorURL);
export const institutionAPI = createAxiosInstance(dynamicOrchestratorURL);
