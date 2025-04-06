const mongoose = require('mongoose');

const SubjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Subject name is required'],
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
    enum: [
      'Semester 1', 
      'Semester 2', 
      'Semester 3', 
      'Semester 4', 
      'Semester 5', 
      'Semester 6', 
      'Semester 7', 
      'Semester 8'
    ]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add indexes for better query performance
SubjectSchema.index({ year: 1, semester: 1 });

module.exports = mongoose.model('Subject', SubjectSchema); 