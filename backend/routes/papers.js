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
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', getPapers);
router.get('/:id', getPaper);
router.put('/:id/download', incrementDownload);

// Protected routes
router.post('/', protect, authorize('admin'), upload, createPaper);
router.put('/:id', protect, authorize('admin'), updatePaper);
router.delete('/:id', protect, authorize('admin'), deletePaper);
router.get('/stats/overview', protect, authorize('admin'), getPaperStats);

module.exports = router;
