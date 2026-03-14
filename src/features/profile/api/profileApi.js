import apiClient from '../../../shared/api/apiClient';

export const profileApi = {
  getProfile: () => apiClient.get('/users/profile'),
  updateProfile: (data) => apiClient.put('/users/profile', data),
};

export const tagsApi = {
  createBulk: (names) => apiClient.post('/tags/bulk', { names }),
};
