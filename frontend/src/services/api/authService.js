import api from './api';

export const authService = {
  // Register a new user
  register: async (userData) => {
    try {
      const response = await api.post('/api/auth/register', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Login user with email and password
  login: async (credentials) => {
    try {
      const response = await api.post('/api/auth/login', credentials);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Login or register user with Google
  googleAuth: async (tokenId) => {
    try {
      const response = await api.post('/api/auth/google', { tokenId });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Logout user
  logout: async () => {
    try {
      const response = await api.post('/api/auth/logout');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Refresh access token
  refreshToken: async () => {
    try {
      const response = await api.post('/api/auth/refresh-token');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Request password reset
  requestPasswordReset: async (email) => {
    try {
      const response = await api.post('/api/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Reset password with token
  resetPassword: async (resetData) => {
    try {
      const response = await api.post('/api/auth/reset-password', resetData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Verify user's email
  verifyEmail: async (token) => {
    try {
      const response = await api.get(`/api/auth/verify-email/${token}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default authService; 