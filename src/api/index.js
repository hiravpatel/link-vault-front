import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' }
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('lv_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('lv_token');
      localStorage.removeItem('lv_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// Auth
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
};

// Users
export const usersAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
};

// Bookmarks
export const bookmarksAPI = {
  getAll: () => api.get('/bookmarks'),
  create: (data) => api.post('/bookmarks', data),
  delete: (id) => api.delete(`/bookmarks/${id}`),
};

// Tags
export const tagsAPI = {
  getAll: () => api.get('/tags'),
  create: (name) => api.post('/tags', { name }),
  createBulk: (names) => api.post('/tags/bulk', { names }),
  delete: (id) => api.delete(`/tags/${id}`),
};
