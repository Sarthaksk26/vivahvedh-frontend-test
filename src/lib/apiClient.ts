import axios, { AxiosError, type InternalAxiosRequestConfig, type AxiosResponse } from 'axios';
import { authStorage } from './authStorage';
import type { ApiErrorResponse } from '../types';

let API_URL = import.meta.env.VITE_API_URL;
if (!API_URL) {
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    API_URL = 'http://localhost:5000/api';
  } else {
    // In production builds, VITE_API_URL must be set at build time.
    // No hardcoded fallback — prevents leaking infra details into the bundle.
    console.error('[apiClient] VITE_API_URL is not set. API calls will fail.');
    API_URL = '/api'; // relative fallback — will 404 but won't leak domains
  }
}

if (API_URL && !API_URL.endsWith('/api')) {
  API_URL = API_URL.endsWith('/') ? `${API_URL}api` : `${API_URL}/api`;
}

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Required for HttpOnly cookie transmission
});

// ═══════════════════════════════════════════════════════════════════
//  Silent Token Refresh Interceptor
// ═══════════════════════════════════════════════════════════════════

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: AxiosResponse) => void;
  reject: (error: AxiosError) => void;
  config: InternalAxiosRequestConfig;
}> = [];

const processQueue = (error: AxiosError | null): void => {
  failedQueue.forEach(({ resolve, reject, config }) => {
    if (error) {
      reject(error);
    } else {
      // Replay the original request and resolve with the resulting promise
      apiClient(config).then(resolve).catch(reject);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Only intercept 401s (not 403s) and not on auth endpoints themselves
    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      originalRequest.url?.includes('/auth/login') ||
      originalRequest.url?.includes('/auth/register') ||
      originalRequest.url?.includes('/auth/refresh')
    ) {
      return Promise.reject(error);
    }

    // If already refreshing, queue this request
    if (isRefreshing) {
      return new Promise<AxiosResponse>((resolve, reject) => {
        failedQueue.push({ resolve, reject, config: originalRequest });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      // Silent refresh — the refresh token is in the HttpOnly cookie
      const refreshResponse = await apiClient.post('/auth/refresh');
      
      // Update stored user metadata if refresh returned fresh data
      if (refreshResponse.data?.user) {
        authStorage.setUser(refreshResponse.data.user);
      }

      // Reset refreshing state BEFORE replaying queue
      isRefreshing = false;

      // Replay all queued requests
      processQueue(null);

      // Replay the original request
      return apiClient(originalRequest);
    } catch (refreshError) {
      isRefreshing = false;
      // Refresh failed — session is dead
      processQueue(refreshError as AxiosError);
      authStorage.clearSession();

      // Redirect to login only if not already there
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login?expired=true';
      }

      return Promise.reject(refreshError);
    }
  }
);

export default apiClient;
