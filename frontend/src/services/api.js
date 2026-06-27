import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'Something went wrong';
    
    // Check if we have validation errors array
    if (error.response?.data?.errors) {
      const errs = error.response.data.errors;
      toast.error(errs[0].message);
    } else if (error.response?.status === 401) {
      // Unauthorized: clear token and redirect (usually handled in AuthContext, but we can clear token here)
      if (localStorage.getItem('token')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        toast.error('Session expired. Please login again.');
      } else {
        toast.error(message);
      }
    } else if (error.response?.status === 403) {
      toast.error('You are not authorized to perform this action.');
    } else {
      toast.error(message);
    }
    
    return Promise.reject(error);
  }
);

export default api;
