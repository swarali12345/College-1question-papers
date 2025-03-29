import axios from '../utils/axios';

export const authService = {
  login: async (email, password) => {
    try {
      console.log('Attempting login with:', { email, password });
      const response = await axios.post('/api/auth/login', { email, password });
      console.log('Login response:', response.data);
      if (response.data?.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('userRole', response.data.user.isAdmin ? 'admin' : 'user');
      }
      return response.data;
    } catch (error) {
      console.error('Login error details:', error.response || error);
      throw error.response?.data || { message: 'Login failed' };
    }
  },

  register: async (name, email, password) => {
    try {
      console.log('Attempting registration with:', { name, email, password });
      const response = await axios.post('/api/auth/register', { name, email, password });
      console.log('Registration response:', response.data);
      if (response.data?.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('userRole', response.data.user.isAdmin ? 'admin' : 'user');
      }
      return response.data;
    } catch (error) {
      console.error('Registration error details:', error.response || error);
      throw error.response?.data || { message: 'Registration failed' };
    }
  },

  logout: async () => {
    try {
      await axios.post('/api/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('userRole');
      window.location.href = '/login';
    }
  },

  getProfile: async () => {
    try {
      const response = await axios.get('/api/auth/me');
      if (response.data?.data) {
        localStorage.setItem('user', JSON.stringify(response.data.data));
        localStorage.setItem('userRole', response.data.data.isAdmin ? 'admin' : 'user');
      }
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to get profile' };
    }
  },

  updateProfile: async (userData) => {
    try {
      const response = await axios.put('/api/auth/updatedetails', userData);
      if (response.data?.data) {
        localStorage.setItem('user', JSON.stringify(response.data.data));
      }
      return response.data.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update profile' };
    }
  },

  updatePassword: async (passwordData) => {
    try {
      const response = await axios.put('/api/auth/updatepassword', passwordData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update password' };
    }
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  getUserRole: () => {
    return localStorage.getItem('userRole');
  },

  getUser: () => {
    const userJson = localStorage.getItem('user');
    return userJson ? JSON.parse(userJson) : null;
  }
}; 