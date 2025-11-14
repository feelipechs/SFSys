import api from './api';

const DonationService = {
  findAll: async () => {
    const response = await api.get('/donations');
    return response.data;
  },

  findById: async (id) => {
    const response = await api.get(`/donations/${id}`);
    return response.data;
  },

  create: async (donationsData) => {
    const response = await api.post('/donations', donationsData);
    return response.data;
  },

  update: async ({ id, ...updates }) => {
    const response = await api.put(`/donations/${id}`, updates);
    return response.data;
  },

  delete: async (id) => {
    await api.delete(`/donations/${id}`);
    return id;
  },
};

export default DonationService;
