import api from './api';

const UserService = {
  findAll: async () => {
    const response = await api.get('/users');
    return response.data;
  },

  findById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  create: async (userData) => {
    const response = await api.post('/users', userData);
    return response.data;
  },

  update: async ({ id, ...updates }) => {
    const response = await api.put(`/users/${id}`, updates);
    return response.data;
  },

  delete: async (id) => {
    await api.delete(`/users/${id}`);
    return id;
  },

  updateProfile: async (updates) => {
    // a rota do backend /users/me não requer o ID na URL
    const response = await api.put('/users/me', updates);
    return response.data;
  },

  getStats: async () => {
    return api.get('/users/me/stats');
  },
};

export default UserService;
