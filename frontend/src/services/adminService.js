import api from './api';

export const adminService = {
  getDashboardStats: async () => {
    const response = await api.get('/dashboard/admin');
    return response.data;
  },
  
  getUsers: async (params = {}) => {
    const response = await api.get('/users', { params });
    return response.data;
  },
  
  createUser: async (userData) => {
    const response = await api.post('/users', userData);
    return response.data;
  },
  
  updateUser: async (id, userData) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },
  
  deleteUser: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },

  createStore: async (storeData) => {
    const response = await api.post('/stores', storeData);
    return response.data;
  },
  
  updateStore: async (id, storeData) => {
    const response = await api.put(`/stores/${id}`, storeData);
    return response.data;
  },
  
  deleteStore: async (id) => {
    const response = await api.delete(`/stores/${id}`);
    return response.data;
  }
};
