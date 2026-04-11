import axios from 'axios';

// The base URL of our new Express Backend
const API_URL = import.meta.env.VITE_API_URL || 'https://vivahvedh-api.onrender.com/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to automatically attach the Auth Token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('vivah_auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
