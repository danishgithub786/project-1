const Job = require('../models/Job');
const User = require('../models/User');

// Create new job posting
const createJob = async (req, res) => {
  try {
    const {
      title,
      company,
      location,
      description,
      requirements,
      salaryMin,
      salaryMax,
      jobType,
      experience
    } = req.body;

    const job = new Job({
      title,
      company,
      location,
      description,
      requirements,
      salary: {
        min: salaryMin,
        max: salaryMax,
        currency: 'USD'
      },
      jobType,
      experience,
      employer: req.userId
    });

    await job.save();

    res.status(201).json({
      message: 'Job posted successfully',
      job
    });

  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({ message: 'Server error while creating job' });
  }
};

// Get all active jobs
const getAllJobs = async (req, res) => {
  try {
    const { search, location, jobType, experience } = req.query;
    
    let query = { isActive: true };

    // Add search filters
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    if (jobType) {
      query.jobType = jobType;
    }

    if (experience) {
      query.experience = experience;
    }

    const jobs = await Job.find(query)
      .populate('employer', 'firstName lastName company')
      .sort({ createdAt: -1 });

    res.json({ jobs });

  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({ message: 'Server error while fetching jobs' });
  }
};

// Get job by ID
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('employer', 'firstName lastName company email phone')
      .populate('applications.jobseeker', 'firstName lastName email')
      .populate('applications.resume', 'originalName');

    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    res.json({ job });

  } catch (error) {
    console.error('Get job error:', error);
    res.status(500).json({ message: 'Server error while fetching job' });
  }
};

// Get jobs posted by employer
const getEmployerJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ employer: req.userId })
      .populate('applications.jobseeker', 'firstName lastName email')
      .sort({ createdAt: -1 });

    res.json({ jobs });

  } catch (error) {
    console.error('Get employer jobs error:', error);
    res.status(500).json({ message: 'Server error while fetching employer jobs' });
  }
};

// Apply for a job
const applyForJob = async (req, res) => {
  try {
    const { resumeId } = req.body;
    const jobId = req.params.id;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if already applied
    const alreadyApplied = job.applications.find(
      app => app.jobseeker.toString() === req.userId
    );

    if (alreadyApplied) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }

    // Add application
    job.applications.push({
      jobseeker: req.userId,
      resume: resumeId
    });

    await job.save();

    res.json({ message: 'Application submitted successfully' });

  } catch (error) {
    console.error('Apply for job error:', error);
    res.status(500).json({ message: 'Server error while applying for job' });
  }
};

// Update job status
const updateJobStatus = async (req, res) => {
  try {
    const { jobId, applicationId, status } = req.body;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Check if user is the employer
    if (job.employer.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to update this job' });
    }

    const application = job.applications.id(applicationId);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    application.status = status;
    await job.save();

    res.json({ message: 'Application status updated successfully' });

  } catch (error) {
    console.error('Update job status error:', error);
    res.status(500).json({ message: 'Server error while updating status' });
  }
};

module.exports = {
  createJob,
  getAllJobs,
  getJobById,
  getEmployerJobs,
  applyForJob,
  updateJobStatus
}; 