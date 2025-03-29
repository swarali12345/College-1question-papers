const Paper = require('../models/Paper');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary storage for multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'pyq_papers',
    resource_type: 'auto',
    allowed_formats: ['pdf'],
    format: 'pdf'
  }
});

// Setup multer for file upload
exports.upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  }
}).single('file');

/**
 * @desc    Create a new paper
 * @route   POST /api/papers
 * @access  Private/Admin
 */
exports.createPaper = async (req, res) => {
  try {
    // req.file contains the uploaded file info
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a PDF file'
      });
    }

    const { title, subject, department, year, semester, examType, tags } = req.body;

    // Create new paper
    const paper = await Paper.create({
      title,
      subject,
      department,
      year,
      semester,
      examType,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      fileUrl: req.file.path,
      publicId: req.file.filename,
      uploader: req.user.id,
      approved: true // Admins uploaded papers are automatically approved
    });

    res.status(201).json({
      success: true,
      data: paper
    });
  } catch (error) {
    console.error('Paper upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

/**
 * @desc    Get all papers
 * @route   GET /api/papers
 * @access  Public
 */
exports.getPapers = async (req, res) => {
  try {
    const { 
      department, 
      year, 
      semester, 
      examType, 
      subject, 
      approved,
      search,
      limit = 10,
      page = 1
    } = req.query;

    // Build query
    const query = {};

    if (department) query.department = department;
    if (year) query.year = year;
    if (semester) query.semester = semester;
    if (examType) query.examType = examType;
    if (subject) query.subject = subject;
    
    // For non-admins, only show approved papers
    if (req.user && req.user.role === 'admin') {
      if (approved !== undefined) {
        query.approved = approved === 'true';
      }
    } else {
      query.approved = true;
    }

    // Text search
    if (search) {
      query.$text = { $search: search };
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const papers = await Paper.find(query)
      .populate('uploader', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Paper.countDocuments(query);

    res.status(200).json({
      success: true,
      count: papers.length,
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      data: papers
    });
  } catch (error) {
    console.error('Get papers error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

/**
 * @desc    Get paper by ID
 * @route   GET /api/papers/:id
 * @access  Public (with restrictions)
 */
exports.getPaper = async (req, res) => {
  try {
    const paper = await Paper.findById(req.params.id).populate('uploader', 'name email');

    if (!paper) {
      return res.status(404).json({
        success: false,
        message: 'Paper not found'
      });
    }

    // Check if paper is approved or if user is admin or uploader
    if (!paper.approved && 
        (!req.user || 
         (req.user.role !== 'admin' && 
          paper.uploader._id.toString() !== req.user.id))) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this paper'
      });
    }

    // Increment views
    paper.views += 1;
    await paper.save();

    res.status(200).json({
      success: true,
      data: paper
    });
  } catch (error) {
    console.error('Get paper error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

/**
 * @desc    Update paper
 * @route   PUT /api/papers/:id
 * @access  Private/Admin
 */
exports.updatePaper = async (req, res) => {
  try {
    let paper = await Paper.findById(req.params.id);

    if (!paper) {
      return res.status(404).json({
        success: false,
        message: 'Paper not found'
      });
    }

    // Check ownership or admin status
    if (paper.uploader.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this paper'
      });
    }

    const { title, subject, department, year, semester, examType, tags, approved } = req.body;

    // Update fields if provided
    if (title) paper.title = title;
    if (subject) paper.subject = subject;
    if (department) paper.department = department;
    if (year) paper.year = year;
    if (semester) paper.semester = semester;
    if (examType) paper.examType = examType;
    if (tags) paper.tags = tags.split(',').map(tag => tag.trim());
    
    // Only admin can change approval status
    if (approved !== undefined && req.user.role === 'admin') {
      paper.approved = approved === 'true' || approved === true;
    }

    // Save updates
    await paper.save();

    res.status(200).json({
      success: true,
      data: paper
    });
  } catch (error) {
    console.error('Update paper error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

/**
 * @desc    Delete paper
 * @route   DELETE /api/papers/:id
 * @access  Private/Admin
 */
exports.deletePaper = async (req, res) => {
  try {
    const paper = await Paper.findById(req.params.id);

    if (!paper) {
      return res.status(404).json({
        success: false,
        message: 'Paper not found'
      });
    }

    // Check ownership or admin status
    if (paper.uploader.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this paper'
      });
    }

    // Delete file from Cloudinary
    await cloudinary.uploader.destroy(paper.publicId);

    // Delete paper from database
    await paper.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Paper deleted successfully'
    });
  } catch (error) {
    console.error('Delete paper error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

/**
 * @desc    Increment download count
 * @route   PUT /api/papers/:id/download
 * @access  Public
 */
exports.incrementDownload = async (req, res) => {
  try {
    const paper = await Paper.findById(req.params.id);

    if (!paper) {
      return res.status(404).json({
        success: false,
        message: 'Paper not found'
      });
    }

    // Check if paper is approved or if user is admin or uploader
    if (!paper.approved && 
        (!req.user || 
         (req.user.role !== 'admin' && 
          paper.uploader.toString() !== req.user.id))) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to download this paper'
      });
    }

    // Increment downloads
    paper.downloads += 1;
    await paper.save();

    res.status(200).json({
      success: true,
      message: 'Download count incremented',
      fileUrl: paper.fileUrl
    });
  } catch (error) {
    console.error('Increment download error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

/**
 * @desc    Get paper statistics
 * @route   GET /api/papers/stats
 * @access  Private/Admin
 */
exports.getPaperStats = async (req, res) => {
  try {
    // Total count
    const totalPapers = await Paper.countDocuments();
    
    // Approved vs pending
    const approvedPapers = await Paper.countDocuments({ approved: true });
    const pendingPapers = await Paper.countDocuments({ approved: false });
    
    // Papers by department
    const papersByDepartment = await Paper.aggregate([
      { $group: { _id: '$department', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    // Papers by year
    const papersByYear = await Paper.aggregate([
      { $group: { _id: '$year', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    
    // Recent papers (last 7 days)
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    
    const recentPapers = await Paper.countDocuments({
      createdAt: { $gte: lastWeek }
    });
    
    // Most viewed papers
    const mostViewedPapers = await Paper.find()
      .sort({ views: -1 })
      .limit(5)
      .select('title views downloads');
    
    // Most downloaded papers
    const mostDownloadedPapers = await Paper.find()
      .sort({ downloads: -1 })
      .limit(5)
      .select('title views downloads');
    
    res.status(200).json({
      success: true,
      data: {
        totalPapers,
        approvedPapers,
        pendingPapers,
        papersByDepartment,
        papersByYear,
        recentPapers,
        mostViewedPapers,
        mostDownloadedPapers
      }
    });
  } catch (error) {
    console.error('Get paper stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
}; 