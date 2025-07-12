const Resume = require('../models/Resume');
const path = require('path');
const fs = require('fs');

// Upload resume
const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Check file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(req.file.mimetype)) {
      // Delete uploaded file
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: 'Only PDF and Word documents are allowed' });
    }

    // Check file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (req.file.size > maxSize) {
      // Delete uploaded file
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: 'File size too large. Maximum size is 5MB' });
    }

    // Create resume record
    const resume = new Resume({
      jobseeker: req.userId,
      filename: req.file.filename,
      originalName: req.file.originalname,
      filePath: req.file.path,
      fileSize: req.file.size,
      mimeType: req.file.mimetype
    });

    await resume.save();

    res.status(201).json({
      message: 'Resume uploaded successfully',
      resume: {
        _id: resume._id,
        originalName: resume.originalName,
        fileSize: resume.fileSize,
        uploadedAt: resume.uploadedAt
      }
    });

  } catch (error) {
    console.error('Upload resume error:', error);
    res.status(500).json({ message: 'Server error while uploading resume' });
  }
};

// Get user's resumes
const getUserResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ 
      jobseeker: req.userId,
      isActive: true 
    }).sort({ uploadedAt: -1 });

    res.json({ resumes });

  } catch (error) {
    console.error('Get resumes error:', error);
    res.status(500).json({ message: 'Server error while fetching resumes' });
  }
};

// Download resume
const downloadResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    // Check if file exists
    if (!fs.existsSync(resume.filePath)) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Set headers for download
    res.setHeader('Content-Type', resume.mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${resume.originalName}"`);
    
    // Stream the file
    const fileStream = fs.createReadStream(resume.filePath);
    fileStream.pipe(res);

  } catch (error) {
    console.error('Download resume error:', error);
    res.status(500).json({ message: 'Server error while downloading resume' });
  }
};

// Delete resume
const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);
    
    if (!resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }

    // Check if user owns this resume
    if (resume.jobseeker.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this resume' });
    }

    // Delete file from filesystem
    if (fs.existsSync(resume.filePath)) {
      fs.unlinkSync(resume.filePath);
    }

    // Delete from database
    await Resume.findByIdAndDelete(req.params.id);

    res.json({ message: 'Resume deleted successfully' });

  } catch (error) {
    console.error('Delete resume error:', error);
    res.status(500).json({ message: 'Server error while deleting resume' });
  }
};

module.exports = {
  uploadResume,
  getUserResumes,
  downloadResume,
  deleteResume
}; 