import axios from '../utils/axios';

export const feedbackService = {
  getAllFeedback: async () => {
    try {
      const response = await axios.get('/api/feedback');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch feedback' };
    }
  },

  getPaperFeedback: async (paperId) => {
    try {
      const response = await axios.get(`/api/feedback/paper/${paperId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch paper feedback' };
    }
  },

  createFeedback: async (feedbackData) => {
    try {
      const response = await axios.post('/api/feedback', feedbackData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create feedback' };
    }
  },

  updateFeedbackStatus: async (id, statusData) => {
    try {
      const response = await axios.put(`/api/feedback/${id}`, statusData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update feedback status' };
    }
  },

  deleteFeedback: async (id) => {
    try {
      const response = await axios.delete(`/api/feedback/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete feedback' };
    }
  }
}; 