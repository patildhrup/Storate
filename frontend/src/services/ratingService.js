import api from './api';

export const ratingService = {
  submitRating: async (data) => {
    const response = await api.post('/ratings', data);
    return response.data;
  },
  
  updateRating: async (id, data) => {
    const response = await api.put(`/ratings/${id}`, data);
    return response.data;
  },
  
  getStoreRatings: async (storeId) => {
    const response = await api.get(`/ratings/store/${storeId}`);
    return response.data;
  },
  
  getUserRatings: async () => {
    const response = await api.get('/ratings/user');
    return response.data;
  }
};
