import axios from 'axios';
import { STORAGE_KEYS, API_ENDPOINTS } from '../constants';

// Create an axios instance with default configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'https://college-question-papers-backend.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for cookies
});

// Request interceptor to add the auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If the error is 401 (Unauthorized) and it's not a retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Call the refresh token endpoint
        const response = await axios.get('/auth/refresh', { 
          withCredentials: true 
        });
        
        // If successful, set the new token and retry the request
        if (response.data?.accessToken) {
          localStorage.setItem(STORAGE_KEYS.TOKEN, response.data.accessToken);
          api.defaults.headers.common['Authorization'] = `Bearer ${response.data.accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // If refresh fails, clear user data and redirect to login
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth Services
const authService = {
  login: async (credentials) => {
    const response = await api.post(API_ENDPOINTS.LOGIN, credentials);
    if (response.data?.token) {
      localStorage.setItem(STORAGE_KEYS.TOKEN, response.data.token);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data.user));
    }
    return response.data;
  },
  
  register: async (userData) => {
    const response = await api.post(API_ENDPOINTS.REGISTER, userData);
    if (response.data?.token) {
      localStorage.setItem(STORAGE_KEYS.TOKEN, response.data.token);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data.user));
    }
    return response.data;
  },
  
  logout: async () => {
    await api.post(API_ENDPOINTS.LOGOUT);
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  },
  
  getCurrentUser: async () => {
    const response = await api.get(API_ENDPOINTS.PROFILE);
    if (response.data) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data));
    }
    return response.data;
  },
  
  googleLogin: async (tokenId) => {
    const response = await api.post(API_ENDPOINTS.GOOGLE_LOGIN, { tokenId });
    if (response.data?.token) {
      localStorage.setItem(STORAGE_KEYS.TOKEN, response.data.token);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(response.data.user));
    }
    return response.data;
  },
  
  updateProfile: async (profileData) => {
    const response = await api.put(API_ENDPOINTS.PROFILE, profileData);
    if (response.data) {
      // Update stored user data
      const storedUser = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER) || '{}');
      const updatedUser = { ...storedUser, ...response.data };
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
    }
    return response.data;
  },
};

// Paper Services
const paperService = {
  getAllPapers: async (page = 1, limit = 10, filters = {}) => {
    const params = { page, limit, ...filters };
    return api.get(API_ENDPOINTS.PAPERS, { params });
  },
  
  getPaper: async (id) => {
    return api.get(`${API_ENDPOINTS.PAPERS}/${id}`);
  },
  
  searchPapers: async (searchQuery, filters = {}) => {
    const params = { q: searchQuery, ...filters };
    return api.get(`${API_ENDPOINTS.PAPERS}/search`, { params });
  },
  
  uploadPaper: async (formData) => {
    return api.post(`${API_ENDPOINTS.PAPERS}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  updatePaper: async (id, paperData) => {
    return api.put(`${API_ENDPOINTS.PAPERS}/${id}`, paperData);
  },
  
  deletePaper: async (id) => {
    return api.delete(`${API_ENDPOINTS.PAPERS}/${id}`);
  },
  
  getDepartmentStats: async () => {
    return api.get(`${API_ENDPOINTS.PAPERS}/stats/departments`);
  },
  
  getYearStats: async () => {
    return api.get(`${API_ENDPOINTS.PAPERS}/stats/years`);
  },
};

// User Services
const userService = {
  getAllUsers: async () => {
    return api.get('/users');
  },
  
  getUser: async (id) => {
    return api.get(`/users/${id}`);
  },
  
  deleteUser: async (id) => {
    return api.delete(`/users/${id}`);
  },
};

export { api, authService, paperService, userService }; 
