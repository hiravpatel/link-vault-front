import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('lv_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response interceptor: handle token expiration and standardise data access
 *
 * Backend returns: { success, message, data, errors }
 */
apiClient.interceptors.response.use(
  (response) => {
    // Return only the data part of the response body for convenience
    // This is the { success, message, data } object
    return response.data;
  },
  (error) => {
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem('lv_token');
      localStorage.removeItem('lv_user');
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        window.location.href = '/login';
      }
    }

    // Extract message from backend response if available
    const message = error.response?.data?.message || 'Something went wrong';
    const errors = error.response?.data?.errors || [];

    return Promise.reject({
      message,
      errors,
      status: error.response?.status,
    });
  }
);

export default apiClient;
