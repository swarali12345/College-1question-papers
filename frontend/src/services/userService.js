import axios from '../utils/axios';

export const userService = {
  getAllUsers: async () => {
    try {
      const response = await axios.get('/api/users');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch users' };
    }
  },

  getUserById: async (id) => {
    try {
      const response = await axios.get(`/api/users/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch user' };
    }
  },

  updateUser: async (id, userData) => {
    try {
      const response = await axios.put(`/api/users/${id}`, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update user' };
    }
  },

  deleteUser: async (id) => {
    try {
      const response = await axios.delete(`/api/users/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete user' };
    }
  },

  getUserStats: async () => {
    try {
      const response = await axios.get('/api/users/stats');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch user statistics' };
    }
  }
}; 