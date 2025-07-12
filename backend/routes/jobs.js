const express = require('express');
const router = express.Router();
const { 
  createJob, 
  getAllJobs, 
  getJobById, 
  getEmployerJobs, 
  applyForJob, 
  updateJobStatus 
} = require('../controllers/jobController');
const { auth, isEmployer, isJobseeker } = require('../middleware/auth');

// Public routes
router.get('/', getAllJobs);
router.get('/:id', getJobById);

// Protected routes
router.post('/', auth, isEmployer, createJob);
router.get('/employer/my-jobs', auth, isEmployer, getEmployerJobs);
router.post('/:id/apply', auth, isJobseeker, applyForJob);
router.put('/application/status', auth, isEmployer, updateJobStatus);

module.exports = router; 