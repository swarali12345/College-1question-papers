import api from './api';

export const paperService = {
  // Get all papers with optional filtering
  getPapers: async (queryParams) => {
    try {
      const response = await api.get(`/api/papers${queryParams ? `?${queryParams}` : ''}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get a single paper by ID
  getPaper: async (id) => {
    try {
      const response = await api.get(`/api/papers/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Upload a new paper
  uploadPaper: async (paperData) => {
    try {
      const response = await api.post('/api/papers', paperData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Update an existing paper
  updatePaper: async (id, paperData) => {
    try {
      const response = await api.put(`/api/papers/${id}`, paperData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Delete a paper
  deletePaper: async (id) => {
    try {
      const response = await api.delete(`/api/papers/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Increment download count
  incrementDownload: async (id) => {
    try {
      const response = await api.post(`/api/papers/${id}/download`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get paper stats (for admin dashboard)
  getPaperStats: async () => {
    try {
      const response = await api.get('/api/papers/stats');
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Search papers by keyword
  searchPapers: async (query, filters = {}) => {
    try {
      // Build query string
      const params = new URLSearchParams();
      
      if (query) {
        params.append('search', query);
      }
      
      // Add filters (department, year, semester, examType)
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          params.append(key, value);
        }
      });
      
      const response = await api.get(`/api/papers?${params}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default paperService; 