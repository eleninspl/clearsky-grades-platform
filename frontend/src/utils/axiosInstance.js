// ✅ Δυναμικό backend URL βασισμένο στο hostname του browser
import axios from 'axios';

// ✅ Use env or fallback to current hostname
const dynamicOrchestratorURL =
  import.meta.env.VITE_ORCHESTRATOR_API_URL ||
  `http://${window.location.hostname}:5005`;

console.log('🌐 Using orchestrator at', dynamicOrchestratorURL);

// 🔧 Axios factory with auth + error handling
const createAxiosInstance = (baseURL) => {
  const instance = axios.create({ baseURL, withCredentials: true });

  instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  instance.interceptors.response.use(
    (res) => res,
    (err) => {
      if (err.response?.status === 401) {
        console.warn('🔒 Unauthorized — logging out...');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      return Promise.reject(err);
    }
  );

  return instance;
};

// All APIs talk to the orchestrator
export const orchestratorAPI = createAxiosInstance(dynamicOrchestratorURL);
export const authAPI = createAxiosInstance(dynamicOrchestratorURL);
export const creditsAPI = createAxiosInstance(dynamicOrchestratorURL);
export const reviewAPI = createAxiosInstance(dynamicOrchestratorURL);
export const gradesAPI = createAxiosInstance(dynamicOrchestratorURL);
export const institutionAPI = createAxiosInstance(dynamicOrchestratorURL);
