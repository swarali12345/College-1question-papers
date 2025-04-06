import { api } from './api';

const SUBJECTS_ENDPOINT = '/api/subjects';

export const subjectService = {
  // Get all subjects
  getAllSubjects: async () => {
    try {
      const response = await api.get(SUBJECTS_ENDPOINT);
      return response.data;
    } catch (error) {
      console.error('Error fetching subjects:', error);
      throw error;
    }
  },
  
  // Get subjects by year and semester
  getSubjectsByYearAndSemester: async (year, semester) => {
    try {
      const response = await api.get(`${SUBJECTS_ENDPOINT}/filter`, {
        params: { year, semester }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching subjects by criteria:', error);
      throw error;
    }
  },
  
  // Create a new subject (admin only)
  createSubject: async (subjectData) => {
    try {
      const response = await api.post(SUBJECTS_ENDPOINT, subjectData);
      return response.data;
    } catch (error) {
      console.error('Error creating subject:', error);
      throw error;
    }
  },
  
  // Get subject by ID
  getSubjectById: async (id) => {
    try {
      const response = await api.get(`${SUBJECTS_ENDPOINT}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching subject:', error);
      throw error;
    }
  },
  
  // Delete a subject (admin only)
  deleteSubject: async (id) => {
    try {
      const response = await api.delete(`${SUBJECTS_ENDPOINT}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting subject:', error);
      throw error;
    }
  }
}; 