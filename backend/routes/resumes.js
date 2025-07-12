const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { 
  uploadResume, 
  getUserResumes, 
  downloadResume, 
  deleteResume 
} = require('../controllers/resumeController');
const { auth, isJobseeker } = require('../middleware/auth');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = process.env.UPLOAD_PATH || 'uploads/';
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 // Default 5MB limit
  }
});

// Create uploads directory if it doesn't exist
const fs = require('fs');
const uploadPath = process.env.UPLOAD_PATH || 'uploads/';
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Protected routes (jobseekers only)
router.post('/upload', auth, isJobseeker, upload.single('resume'), uploadResume);
router.get('/', auth, isJobseeker, getUserResumes);
router.get('/:id/download', auth, downloadResume);
router.delete('/:id', auth, isJobseeker, deleteResume);

module.exports = router; 