import apiClient from '../../../shared/api/apiClient';

export const bookmarksApi = {
  getAll: (params = {}) => apiClient.get('/bookmarks', { params }),
  create: (data) => apiClient.post('/bookmarks', data),
  update: (id, data) => apiClient.patch(`/bookmarks/${id}`, data),
  delete: (id) => apiClient.delete(`/bookmarks/${id}`),
};
