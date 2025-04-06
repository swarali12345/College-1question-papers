const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Paper = require('../models/Paper');
const Subject = require('../models/Subject');

// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected!');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

// Function to migrate subjects from papers
const migrateSubjectsFromPapers = async () => {
  try {
    console.log('Starting subject migration...');
    
    // Get all distinct combinations of subject, year, and semester from papers
    const papers = await Paper.find().select('subject year semester');
    
    console.log(`Found ${papers.length} papers to process`);
    
    // Track unique combinations to avoid duplicates
    const processedCombinations = new Set();
    let addedCount = 0;
    let existingCount = 0;
    
    for (const paper of papers) {
      const { subject, year, semester } = paper;
      
      // Skip if any required field is missing
      if (!subject || !year || !semester) {
        console.log('Skipping paper with missing data:', paper._id);
        continue;
      }
      
      // Create a key to track unique combinations
      const combinationKey = `${subject}-${year}-${semester}`;
      
      // Skip if we've already processed this combination
      if (processedCombinations.has(combinationKey)) {
        continue;
      }
      
      // Mark this combination as processed
      processedCombinations.add(combinationKey);
      
      // Check if subject already exists
      const existingSubject = await Subject.findOne({
        name: subject,
        year: year,
        semester: semester
      });
      
      if (existingSubject) {
        existingCount++;
        console.log(`Subject already exists: ${subject} (${year} - ${semester})`);
      } else {
        // Create new subject
        await Subject.create({
          name: subject,
          year: year,
          semester: semester
        });
        addedCount++;
        console.log(`Created new subject: ${subject} (${year} - ${semester})`);
      }
    }
    
    console.log(`Migration complete!`);
    console.log(`Added ${addedCount} new subjects`);
    console.log(`Found ${existingCount} existing subjects`);
    
    return { addedCount, existingCount, totalProcessed: papers.length };
  } catch (error) {
    console.error('Subject migration error:', error);
    throw error;
  }
};

// Main function
const runMigration = async () => {
  try {
    await connectDB();
    await migrateSubjectsFromPapers();
    console.log('Migration completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

// Run the migration
runMigration(); 