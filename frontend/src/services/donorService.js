import api from './api';

const DonorService = {
  findAll: async () => {
    const response = await api.get('/donors');
    return response.data;
  },

  findById: async (id) => {
    const response = await api.get(`/donors/${id}`);
    return response.data;
  },

  create: async (donorsData) => {
    const response = await api.post('/donors', donorsData);
    return response.data;
  },

  update: async ({ id, ...updates }) => {
    const response = await api.put(`/donors/${id}`, updates);
    return response.data;
  },

  delete: async (id) => {
    await api.delete(`/donors/${id}`);
    return id;
  },
};

export default DonorService;
