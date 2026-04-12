import apiClient, { refreshClient } from '../../../shared/api/apiClient';

export const authApi = {
  register: (userData) => apiClient.post('/auth/register', userData),
  login: (credentials) => apiClient.post('/auth/login', credentials),
  refreshSession: async () => {
    const response = await refreshClient.post('/auth/refresh');
    return response.data;
  },
  logout: async () => {
    const response = await refreshClient.post('/auth/logout');
    return response.data;
  },
  forgotPassword: (payload) => apiClient.post('/auth/forgot-password', payload),
  resetPassword: (payload) => apiClient.post('/auth/reset-password', payload),
  changePassword: (payload) => apiClient.post('/auth/change-password', payload),
};
