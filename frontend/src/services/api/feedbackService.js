import api from './api';

export const feedbackService = {
  // Get all feedbacks (admin only)
  getFeedbacks: async (queryParams) => {
    try {
      const response = await api.get(`/api/feedback${queryParams ? `?${queryParams}` : ''}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Get feedbacks for a specific paper
  getPaperFeedbacks: async (paperId, queryParams) => {
    try {
      const response = await api.get(`/api/feedback/paper/${paperId}${queryParams ? `?${queryParams}` : ''}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Create a new feedback
  createFeedback: async (feedbackData) => {
    try {
      const response = await api.post('/api/feedback', feedbackData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Update feedback status (admin only)
  updateFeedbackStatus: async (id, statusData) => {
    try {
      const response = await api.put(`/api/feedback/${id}`, statusData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Delete a feedback
  deleteFeedback: async (id) => {
    try {
      const response = await api.delete(`/api/feedback/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default feedbackService; 