import api from './api';

export const userService = {
  // Get all users (admin only)
  getUsers: async (queryParams) => {
    try {
      const response = await api.get(`/api/users${queryParams ? `?${queryParams}` : ''}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get a single user by ID
  getUser: async (id) => {
    try {
      const response = await api.get(`/api/users/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get current user profile
  getProfile: async () => {
    try {
      const response = await api.get('/api/users/me');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Update user information
  updateUser: async (id, userData) => {
    try {
      const response = await api.put(`/api/users/${id}`, userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Update current user's profile
  updateProfile: async (userData) => {
    try {
      const response = await api.put('/api/users/me', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Delete a user (admin only)
  deleteUser: async (id) => {
    try {
      const response = await api.delete(`/api/users/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Change password
  changePassword: async (passwordData) => {
    try {
      const response = await api.put('/api/users/me/password', passwordData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get user statistics (admin only)
  getUserStats: async () => {
    try {
      const response = await api.get('/api/users/stats');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get user's uploaded papers
  getUserPapers: async (queryParams) => {
    try {
      const response = await api.get(`/api/users/me/papers${queryParams ? `?${queryParams}` : ''}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default userService; 