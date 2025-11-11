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
};

export default UserService;
