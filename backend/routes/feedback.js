const express = require('express');
const router = express.Router();
const {
  createFeedback,
  getFeedbacks,
  getPaperFeedbacks,
  updateFeedbackStatus,
  deleteFeedback
} = require('../controllers/feedbackController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/paper/:paperId', getPaperFeedbacks);

// Private routes (logged in users)
router.post('/', protect, createFeedback);
router.delete('/:id', protect, deleteFeedback);

// Admin routes
router.get('/', protect, authorize('admin'), getFeedbacks);
router.put('/:id', protect, authorize('admin'), updateFeedbackStatus);

module.exports = router; 