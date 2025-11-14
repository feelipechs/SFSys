import api from './api';

const ProductService = {
  findAll: async () => {
    const response = await api.get('/products');
    return response.data;
  },

  findById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  create: async (productsData) => {
    const response = await api.post('/products', productsData);
    return response.data;
  },

  update: async ({ id, ...updates }) => {
    const response = await api.put(`/products/${id}`, updates);
    return response.data;
  },

  delete: async (id) => {
    await api.delete(`/products/${id}`);
    return id;
  },
};

export default ProductService;
