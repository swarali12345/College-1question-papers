const Paper = require('../models/Paper');
const Subject = require('../models/Subject');
const cloudinary = require('cloudinary').v2;
const { handleFileUpload, deleteFileFromCloudinary } = require('../utils/cloudinaryUpload');

// Export the file upload middleware
exports.upload = handleFileUpload;

/**
 * @desc    Create a new paper
 * @route   POST /api/papers
 * @access  Private/Admin
 */
exports.createPaper = async (req, res) => {
  try {
    // req.file contains the uploaded file info (already handled by the upload middleware)
    const { title, subject, batch, year, semester, examType, tags, comment } = req.body;

    // Check if subject exists, if not create it
    try {
      // First check if the subject already exists
      const existingSubject = await Subject.findOne({
        name: subject,
        year: year,
        semester: semester
      });

      if (!existingSubject) {
        // Create new subject in the Subject collection
        await Subject.create({
          name: subject,
          year: year,
          semester: semester
        });
        console.log(`Created new subject: ${subject} (${year} - ${semester})`);
      }
    } catch (subjectError) {
      console.error('Error creating subject:', subjectError);
      // Continue with paper creation even if subject creation fails
    }

    // Create new paper
    const paper = await Paper.create({
      title,
      subject,
      batch,
      year,
      semester,
      examType,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      comment: comment || '',
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
      batch,
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

    if (batch) query.batch = batch;
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

    const { title, subject, batch, year, semester, examType, tags, approved, comment } = req.body;

    // If subject, year or semester has changed, check if the subject exists in the Subject collection
    if ((subject && subject !== paper.subject) || 
        (year && year !== paper.year) || 
        (semester && semester !== paper.semester)) {
      
      try {
        // Use the new values or fall back to existing ones
        const subjectName = subject || paper.subject;
        const subjectYear = year || paper.year;
        const subjectSemester = semester || paper.semester;
        
        // Check if the subject exists
        const existingSubject = await Subject.findOne({
          name: subjectName,
          year: subjectYear,
          semester: subjectSemester
        });
        
        if (!existingSubject) {
          // Create new subject
          await Subject.create({
            name: subjectName,
            year: subjectYear,
            semester: subjectSemester
          });
          console.log(`Created new subject: ${subjectName} (${subjectYear} - ${subjectSemester})`);
        }
      } catch (subjectError) {
        console.error('Error creating subject during paper update:', subjectError);
        // Continue with paper update even if subject creation fails
      }
    }

    // Update fields if provided
    if (title) paper.title = title;
    if (subject) paper.subject = subject;
    if (batch) paper.batch = batch;
    if (year) paper.year = year;
    if (semester) paper.semester = semester;
    if (examType) paper.examType = examType;
    if (tags) paper.tags = typeof tags === 'string' ? tags.split(',').map(tag => tag.trim()) : tags;
    if (comment !== undefined) paper.comment = comment;
    
    // Only admin can change approval status
    if (approved !== undefined && req.user.role === 'admin') {
      paper.approved = approved === 'true' || approved === true;
    }

    // Handle file update if a new file is uploaded
    if (req.file) {
      // Delete the old file from cloudinary
      if (paper.publicId) {
        await deleteFileFromCloudinary(paper.publicId);
      }
      
      // Update with new file info
      paper.fileUrl = req.file.path;
      paper.publicId = req.file.filename;
    }

    // Save the updated paper
    await paper.save();

    res.status(200).json({
      success: true,
      data: paper,
      message: 'Paper updated successfully'
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
    await deleteFileFromCloudinary(paper.publicId);

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
 * @desc    Get paper statistics overview for admin dashboard
 * @route   GET /api/papers/stats/overview
 * @access  Private/Admin
 */
exports.getPaperStats = async (req, res) => {
  try {
    // Total papers count
    const totalPapers = await Paper.countDocuments();
    
    // Approved vs pending papers
    const approvedPapers = await Paper.countDocuments({ approved: true });
    const pendingPapers = await Paper.countDocuments({ approved: false });
    
    // Recent papers (last 5 uploaded)
    const recentPapers = await Paper.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('uploader', 'name email')
      .select('title subject views downloads approved createdAt');
    
    // Most popular papers (by views)
    const topPapers = await Paper.find()
      .sort({ views: -1 })
      .limit(5)
      .populate('uploader', 'name email')
      .select('title subject department views downloads approved');
    
    // Total views and downloads
    const statsAggregation = await Paper.aggregate([
      { 
        $group: { 
          _id: null, 
          totalViews: { $sum: '$views' }, 
          totalDownloads: { $sum: '$downloads' } 
        } 
      }
    ]);
    
    const totalViews = statsAggregation.length > 0 ? statsAggregation[0].totalViews : 0;
    const totalDownloads = statsAggregation.length > 0 ? statsAggregation[0].totalDownloads : 0;
    
    // Papers by department for potential chart data
    const departmentStats = await Paper.aggregate([
      { $group: { _id: '$department', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    // Monthly uploads for chart data - Get all papers with createdAt field
    const allPapers = await Paper.find().select('createdAt');
    
    // Process monthly data
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthCounts = Array(12).fill(0);
    
    // Count papers by month
    allPapers.forEach(paper => {
      if (paper.createdAt) {
        const date = new Date(paper.createdAt);
        const month = date.getMonth(); // 0-11
        monthCounts[month]++;
      }
    });
    
    // Format monthly data
    const formattedMonthlyUploads = months.map((month, index) => ({
      month,
      count: monthCounts[index]
    }));
    
    res.status(200).json({
      success: true,
      data: {
        totalPapers,
        approvedPapers,
        pendingPapers,
        totalViews,
        totalDownloads,
        recentPapers,
        topPapers,
        departmentStats,
        monthlyUploads: formattedMonthlyUploads
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