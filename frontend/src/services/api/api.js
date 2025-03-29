import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    // Get token from local storage
    const token = localStorage.getItem('token');
    
    // If token exists, add it to request headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh on 401 errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 (Unauthorized) and it's not a retry
    if (error.response.status === 401 && !originalRequest._retry) {
      // Mark as retry to avoid infinite loop
      originalRequest._retry = true;
      
      try {
        // Attempt to refresh token
        const response = await axios.post('/api/auth/refresh-token', {}, {
          baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000',
          withCredentials: true
        });
        
        // If token refresh successful, update token in localStorage
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
          
          // Update authorization header with new token
          originalRequest.headers.Authorization = `Bearer ${response.data.token}`;
          
          // Retry the original request
          return api(originalRequest);
        }
      } catch (refreshError) {
        // If refresh fails, clear token and redirect to login
        localStorage.removeItem('token');
        
        // Check if window exists (to avoid SSR issues)
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api; 