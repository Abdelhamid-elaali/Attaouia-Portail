import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const annonceService = {
  getAll: (params) => api.get('/annonces', { params }),
  getById: (id) => api.get(`/annonces/${id}`),
  create: (data) => api.post('/annonces', data),
  update: (id, data) => api.put(`/annonces/${id}`, data),
  delete: (id) => api.delete(`/annonces/${id}`),
};

export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  getCurrentUser: () => api.get('/auth/me'),
};

export const subscriptionService = {
  subscribe: (data) => api.post('/subscribe', data),
};

export const emergencyService = {
  sendAlert: (data) => api.post('/emergency/alert', data),
};

export const userService = {
  createSupervisor: async (data) => {
    console.log('Sending supervisor creation request:', data);
    try {
      const response = await api.post('/users/supervisor', data);
      console.log('Supervisor creation response:', response.data);
      return response;
    } catch (error) {
      console.error('Error in createSupervisor:', error.response || error);
      throw error;
    }
  },
  getSupervisors: () => api.get('/users/supervisors'),
};
