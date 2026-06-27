import api from './api';

export const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  
  changePassword: async (passwords) => {
    const response = await api.put('/auth/change-password', {
      oldPassword: passwords.currentPassword,
      newPassword: passwords.newPassword,
    });
    return response.data;
  }
};
