import api from './api';

const BeneficiaryService = {
  findAll: async () => {
    const response = await api.get('/beneficiaries');
    return response.data;
  },

  findById: async (id) => {
    const response = await api.get(`/beneficiaries/${id}`);
    return response.data;
  },

  create: async (beneficiariesData) => {
    const response = await api.post('/beneficiaries', beneficiariesData);
    return response.data;
  },

  update: async ({ id, ...updates }) => {
    const response = await api.put(`/beneficiaries/${id}`, updates);
    return response.data;
  },

  delete: async (id) => {
    await api.delete(`/beneficiaries/${id}`);
    return id;
  },
};

export default BeneficiaryService;
