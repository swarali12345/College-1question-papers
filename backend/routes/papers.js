const express = require('express');
const router = express.Router();
const {
  createPaper,
  getPapers,
  getPaper,
  updatePaper,
  deletePaper,
  incrementDownload,
  getPaperStats,
  upload
} = require('../controllers/paperController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getPapers);
router.get('/:id', getPaper);
router.put('/:id/download', incrementDownload);

// Protected routes - Allow paper creation, update and deletion for admin or original uploader
router.post('/', protect, upload, createPaper);  // Only authenticated users can create
router.delete('/:id', protect, deletePaper);     // Controller handles permission check

// Admin-only routes
router.get('/stats/overview', protect, adminOnly, getPaperStats);

module.exports = router;
