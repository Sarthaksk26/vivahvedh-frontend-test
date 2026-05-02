import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { authStorage } from './authStorage';

let API_URL = import.meta.env.VITE_API_URL;
if (!API_URL) {
  API_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:5000/api' 
    : 'https://vivahvedh-api.onrender.com/api';
}

if (API_URL && !API_URL.endsWith('/api')) {
  API_URL = API_URL.endsWith('/') ? `${API_URL}api` : `${API_URL}/api`;
}

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = authStorage.getToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Avoid redirect loops if we're already on login
      if (!window.location.pathname.includes('/login')) {
        authStorage.clearToken();
        window.location.href = '/login?expired=true';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
