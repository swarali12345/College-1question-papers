const mongoose = require('mongoose');

const PaperSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    trim: true
  },
  year: {
    type: String,
    required: [true, 'Year is required'],
    enum: ['First Year', 'Second Year', 'Third Year', 'Fourth Year']
  },
  semester: {
    type: String,
    required: [true, 'Semester is required'],
    enum: ['Semester 1', 'Semester 2', 'Semester 3', 'Semester 4', 'Semester 5', 'Semester 6', 'Semester 7', 'Semester 8']
  },
  examType: {
    type: String,
    required: [true, 'Exam type is required'],
    enum: ['Mid-Semester', 'End-Semester', 'Quiz', 'Assignment']
  },
  fileUrl: {
    type: String,
    required: [true, 'File URL is required']
  },
  publicId: {
    type: String,
    required: [true, 'Public ID is required']
  },
  tags: {
    type: [String],
    default: []
  },
  uploader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  approved: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  downloads: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add indexes for better search performance
PaperSchema.index({ title: 'text', subject: 'text', tags: 'text' });
PaperSchema.index({ department: 1, year: 1, semester: 1 });
PaperSchema.index({ approved: 1 });

module.exports = mongoose.model('Paper', PaperSchema); 