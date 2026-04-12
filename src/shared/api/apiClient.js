import axios from 'axios';
import { clearSession, getAccessToken, saveSession } from '../auth/sessionStore';

const baseURL = import.meta.env.VITE_API_URL || '/api';

export const refreshClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

const AUTH_EXCLUDED_PATHS = [
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/auth/refresh',
  '/auth/logout',
];

let refreshPromise = null;

function isPublicAuthPath(url = '') {
  return AUTH_EXCLUDED_PATHS.some(path => url.includes(path));
}

function redirectToLogin() {
  clearSession();

  if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
    window.location.assign('/login');
  }
}

function mapApiError(error) {
  if (!error.response) {
    return {
      message: navigator.onLine
        ? 'Unable to reach the server right now. Please try again.'
        : 'You appear to be offline. Check your connection and try again.',
      status: 0,
      code: 'NETWORK_ERROR',
      errors: [],
      requestId: null,
    };
  }

  return {
    message: error.response.data?.message || 'Something went wrong',
    status: error.response.status,
    code: error.response.data?.code || 'UNKNOWN_ERROR',
    errors: error.response.data?.details || error.response.data?.errors || [],
    requestId: error.response.data?.requestId || null,
  };
}

async function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = refreshClient
      .post('/auth/refresh')
      .then((response) => {
        const session = response.data?.data;
        if (session?.accessToken && session?.user) {
          saveSession(session);
        }
        return session?.accessToken || null;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

apiClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config || {};
    const requestUrl = originalRequest.url || '';

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isPublicAuthPath(requestUrl)
    ) {
      originalRequest._retry = true;

      try {
        const token = await refreshAccessToken();
        if (!token) {
          redirectToLogin();
          return Promise.reject(mapApiError(error));
        }

        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${token}`,
        };

        return apiClient(originalRequest);
      } catch (refreshError) {
        redirectToLogin();
        return Promise.reject(mapApiError(refreshError));
      }
    }

    if (error.response?.status === 401 && requestUrl.includes('/auth/refresh')) {
      redirectToLogin();
    }

    return Promise.reject(mapApiError(error));
  }
);

export default apiClient;
