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

// Set up multer for file upload
const upload = multer({
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

// Wrapper function for multer upload
const handleFileUpload = (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          message: 'File size exceeds the 10MB limit'
        });
      }
      console.error('File upload error:', err);
      return res.status(400).json({
        success: false,
        message: err.message || 'Error uploading file'
      });
    }
    
    // Check if this is a PUT request (update)
    if (req.method === 'PUT') {
      // For updates, file is optional
      next();
    } else {
      // For new papers (POST), file is required
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'Please upload a PDF file'
        });
      }
      next();
    }
  });
};

// Delete file from Cloudinary
const deleteFileFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Error deleting file from Cloudinary:', error);
    throw error;
  }
};

module.exports = {
  handleFileUpload,
  deleteFileFromCloudinary
}; 