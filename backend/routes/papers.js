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

// Protected routes
router.post('/', protect, adminOnly, upload, createPaper);
router.put('/:id', protect, adminOnly, updatePaper);
router.delete('/:id', protect, adminOnly, deletePaper);
router.get('/stats/overview', protect, adminOnly, getPaperStats);

module.exports = router;
