import axios from 'axios';

// The base URL of our new Express Backend
let API_URL = import.meta.env.VITE_API_URL;
if (!API_URL) {
  API_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:5000/api' 
    : 'https://vivahvedh-api-test.onrender.com/api';
}

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
