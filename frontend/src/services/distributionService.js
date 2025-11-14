import api from './api';

const DistributionService = {
  findAll: async () => {
    const response = await api.get('/distributions');
    return response.data;
  },

  findById: async (id) => {
    const response = await api.get(`/distributions/${id}`);
    return response.data;
  },

  create: async (distributionsData) => {
    const response = await api.post('/distributions', distributionsData);
    return response.data;
  },

  update: async ({ id, ...updates }) => {
    const response = await api.put(`/distributions/${id}`, updates);
    return response.data;
  },

  delete: async (id) => {
    await api.delete(`/distributions/${id}`);
    return id;
  },
};

export default DistributionService;
