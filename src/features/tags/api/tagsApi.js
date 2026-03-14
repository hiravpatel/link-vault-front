import apiClient from '../../../shared/api/apiClient';

export const tagsApi = {
  getAll: () => apiClient.get('/tags'),
  create: (name) => apiClient.post('/tags', { name }),
  delete: (id) => apiClient.delete(`/tags/${id}`),
};
