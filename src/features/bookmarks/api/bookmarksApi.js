import apiClient from '../../../shared/api/apiClient';

export const bookmarksApi = {
  getAll: () => apiClient.get('/bookmarks'),
  create: (data) => apiClient.post('/bookmarks', data),
  delete: (id) => apiClient.delete(`/bookmarks/${id}`),
};
