import axios from '../utils/axios';

export const authService = {
  login: async (email, password) => {
    try {
      console.log('Attempting login with:', { email, password });
      const response = await axios.post('/api/auth/login', { email, password });
      console.log('Login response full data:', response);
      console.log('Login response data:', response.data);
      
      // Check if the response contains the expected data
      if (!response.data || !response.data.success) {
        throw new Error('Invalid response from server');
      }
      
      // Store authentication data
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('userRole', response.data.user.isAdmin ? 'admin' : 'user');
        
        // Store redirect information if available
        if (response.data.redirect) {
          localStorage.setItem('redirect', JSON.stringify(response.data.redirect));
        }
        
        console.log('Auth data stored in localStorage:', { 
          token: !!response.data.token,
          user: !!response.data.user,
          isAdmin: response.data.user?.isAdmin,
          redirect: response.data.redirect
        });
      } else {
        console.error('No token in login response:', response.data);
        throw new Error('Login successful but no authentication token received');
      }
      
      return response.data;
    } catch (error) {
      console.error('Login error details:', error);
      
      // Extract meaningful error message
      let errorMessage = 'Login failed';
      
      if (error.response) {
        console.error('Server response error:', error.response.data);
        errorMessage = error.response.data.message || 'Server error during login';
      } else if (error.request) {
        console.error('No response received:', error.request);
        errorMessage = 'No response from server. Please check your internet connection.';
      } else {
        console.error('Error setting up request:', error.message);
        errorMessage = error.message;
      }
      
      throw { message: errorMessage };
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