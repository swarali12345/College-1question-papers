import axios from '../utils/axios';

export const paperService = {
  getAllPapers: async (page = 1, limit = 10, filters = {}) => {
    try {
      const params = { page, limit, ...filters };
      const response = await axios.get('/api/papers', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch papers' };
    }
  },

  getPaper: async (id) => {
    try {
      const response = await axios.get(`/api/papers/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch paper' };
    }
  },

  createPaper: async (paperData) => {
    try {
      const formData = new FormData();
      
      // Append text fields
      Object.keys(paperData).forEach(key => {
        if (key !== 'file') {
          formData.append(key, paperData[key]);
        }
      });
      
      // Append file if it exists
      if (paperData.file) {
        formData.append('file', paperData.file);
      }
      
      const response = await axios.post('/api/papers', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create paper' };
    }
  },

  updatePaper: async (id, paperData) => {
    try {
      const formData = new FormData();
      
      // Append text fields
      Object.keys(paperData).forEach(key => {
        if (key !== 'file') {
          formData.append(key, paperData[key]);
        }
      });
      
      // Append file if it exists
      if (paperData.file) {
        formData.append('file', paperData.file);
      }
      
      const response = await axios.put(`/api/papers/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update paper' };
    }
  },

  deletePaper: async (id) => {
    try {
      const response = await axios.delete(`/api/papers/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete paper' };
    }
  },

  incrementDownload: async (id) => {
    try {
      const response = await axios.put(`/api/papers/${id}/download`);
      return response.data;
    } catch (error) {
      console.error('Failed to increment download count:', error);
      // Return silently as this is not critical
      return null;
    }
  },

  getPaperStats: async () => {
    try {
      const response = await axios.get('/api/papers/stats/overview');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch paper statistics' };
    }
  }
}; 