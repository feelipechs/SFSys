import api from './api';

const NotificationService = {
  findAll: async () => {
    const response = await api.get('/notifications');
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await api.patch('/notifications/read-all');
    return response.data;
  },

  markAsRead: async (id) => {
    const response = await api.patch(`/notifications/${id}/read`);
    return response.data;
  },

  delete: async (id) => {
    await api.delete(`/notifications/${id}`);
    return id;
  },

  deleteAll: async () => {
    const response = await api.delete('/notifications/delete-all');
    return response.data;
  },

  sendBulk: async (bulkData) => {
    const response = await api.post('/notifications/send-bulk', bulkData);
    return response.data;
  },
};

export default NotificationService;
