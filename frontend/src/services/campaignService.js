import api from './api';

const CampaignService = {
  findAll: async () => {
    const response = await api.get('/campaigns');
    return response.data;
  },

  findById: async (id) => {
    const response = await api.get(`/campaigns/${id}`);
    return response.data;
  },

  create: async (campaignsData) => {
    const response = await api.post('/campaigns', campaignsData);
    return response.data;
  },

  update: async ({ id, ...updates }) => {
    const response = await api.put(`/campaigns/${id}`, updates);
    return response.data;
  },

  delete: async (id) => {
    await api.delete(`/campaigns/${id}`);
    return id;
  },
};

export default CampaignService;
