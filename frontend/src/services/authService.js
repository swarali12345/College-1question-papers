import axios from '../utils/axios';

export const authService = {
  login: async (email, password) => {
    try {
      const response = await axios.post('/users/login', { email, password });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Login failed' };
    }
  },

  register: async (name, email, password) => {
    try {
      const response = await axios.post('/users/register', { name, email, password });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Registration failed' };
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    window.location.href = '/login';
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  getUserRole: () => {
    return localStorage.getItem('userRole');
  }
}; 