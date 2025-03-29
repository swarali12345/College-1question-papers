import axios from 'axios';
import { API_ENDPOINTS } from '../../constants';

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
      // In a real implementation, this would be:
      // const response = await axios.post(API_ENDPOINTS.FEEDBACK, feedbackData);
      // return response.data;
      
      // Using mock response for development
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ 
            success: true, 
            message: 'Feedback submitted successfully! Thank you for your input.',
            data: {
              id: `f${Math.floor(Math.random() * 1000)}`,
              ...feedbackData,
              createdAt: new Date(),
              status: 'pending',
              priority: feedbackData.rating > 3 ? 'high' : 'medium'
            }
          });
        }, 800);
      });
    } catch (error) {
      console.error('Error submitting feedback:', error);
      throw error;
    }
  },
  
  /**
   * Get feedback submitted by current user
   * @returns {Promise} Promise object representing the response
   */
  getUserFeedback: async () => {
    try {
      // In a real implementation, this would be:
      // const response = await axios.get(`${API_ENDPOINTS.FEEDBACK}/user`);
      // return response.data;
      
      // Using mock response for development
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve([
            {
              id: 'f101',
              subject: 'Website Suggestions',
              message: 'I think the site navigation could be improved to make finding papers easier.',
              rating: 4,
              createdAt: new Date('2023-03-10'),
              status: 'pending',
              response: null
            },
            {
              id: 'f102',
              subject: 'Paper Upload Experience',
              message: 'The paper upload feature works great, but it would be nice to have a preview before submitting.',
              rating: 3,
              createdAt: new Date('2023-02-15'),
              status: 'resolved',
              response: 'Thank you for your feedback! We are working on adding a preview feature in our next update.'
            }
          ]);
        }, 800);
      });
    } catch (error) {
      console.error('Error fetching user feedback:', error);
      throw error;
    }
  }
}; 