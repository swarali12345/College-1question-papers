import axios from 'axios';
import { API_ENDPOINTS } from '../../constants';
import api from '../../utils/axios';

/**
 * User Feedback Service
 * Handles submitting and managing user feedback
 */
export const userFeedbackService = {
  /**
   * Submit new feedback
   * @param {Object} feedbackData - Feedback data object
   * @param {string} feedbackData.subject - Feedback subject
   * @param {string} feedbackData.message - Feedback message content
   * @param {number} feedbackData.rating - Rating from 1-5
   * @returns {Promise} Promise object representing the response
   */
  submitFeedback: async (feedbackData) => {
    try {
      const response = await api.post('/api/feedback', feedbackData);
      return response.data;
    } catch (error) {
      console.error('Error submitting feedback:', error);
      throw error.response?.data || { message: 'Failed to submit feedback' };
    }
  },
  
  /**
   * Get feedback submitted by current user
   * @returns {Promise} Promise object representing the response
   */
  getUserFeedback: async () => {
    try {
      const response = await api.get('/api/feedback/me');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching user feedback:', error);
      throw error.response?.data || { message: 'Failed to fetch feedback' };
    }
  }
}; 