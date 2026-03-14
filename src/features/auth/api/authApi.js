import apiClient from '../../../shared/api/apiClient';

/**
 * Auth API service
 * Backend returns { success, message, data: { token, user } }
 * responseInterceptor returns just the body { success, message, data }
 */
export const authApi = {
  register: (userData) => apiClient.post('/auth/register', userData),
  login: (credentials) => apiClient.post('/auth/login', credentials),
};
