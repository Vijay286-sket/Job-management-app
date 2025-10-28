const { validationResult } = require('express-validator');
const Job = require('../models/Job');
const User = require('../models/User');

// Create new job (Recruiters only)
const createJob = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const jobData = {
      ...req.body,
      postedBy: req.user._id
    };

    // Create new job
    const job = new Job(jobData);
    await job.save();

    // Populate the postedBy field
    await job.populate('postedBy', 'firstName lastName email company');

    res.status(201).json({
      message: 'Job created successfully',
      job
    });

  } catch (error) {
    console.error('Create job error:', error);
    
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message
      }));
      
      return res.status(400).json({
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    res.status(500).json({
      message: 'Failed to create job',
      error: 'CREATE_JOB_ERROR'
    });
  }
};

// Get all jobs with filtering and pagination
const getJobs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      location,
      jobType,
      experienceLevel,
      minSalary,
      maxSalary,
      remote,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = { status: 'active' };

    // Text search
    if (search) {
      filter.$text = { $search: search };
    }

    // Location filter
    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }

    // Job type filter
    if (jobType) {
      filter.jobType = jobType;
    }

    // Experience level filter
    if (experienceLevel) {
      filter.experienceLevel = experienceLevel;
    }

    // Salary range filter
    if (minSalary || maxSalary) {
      filter.$or = [];
      
      if (minSalary) {
        filter.$or.push({ 'salary.min': { $gte: parseInt(minSalary) } });
        filter.$or.push({ 'salary.max': { $gte: parseInt(minSalary) } });
      }
      
      if (maxSalary) {
        filter.$or.push({ 'salary.max': { $lte: parseInt(maxSalary) } });
        filter.$or.push({ 'salary.min': { $lte: parseInt(maxSalary) } });
      }
    }

    // Remote filter
    if (remote !== undefined) {
      filter.remote = remote === 'true';
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Calculate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Execute query
    const jobs = await Job.find(filter)
      .populate('postedBy', 'firstName lastName company')
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    // Get total count for pagination
    const totalJobs = await Job.countDocuments(filter);
    const totalPages = Math.ceil(totalJobs / limitNum);

    res.status(200).json({
      message: 'Jobs retrieved successfully',
      jobs,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalJobs,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1
      }
    });

  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({
      message: 'Failed to retrieve jobs',
      error: 'GET_JOBS_ERROR'
    });
  }
};

// Get single job by ID
const getJobById = async (req, res) => {
  try {
    const { id } = req.params;

    const job = await Job.findById(id)
      .populate('postedBy', 'firstName lastName email company');

    if (!job) {
      return res.status(404).json({
        message: 'Job not found',
        error: 'JOB_NOT_FOUND'
      });
    }

    // Increment view count (only if not the job poster)
    if (!req.user || job.postedBy._id.toString() !== req.user._id.toString()) {
      await job.incrementViews();
    }

    res.status(200).json({
      message: 'Job retrieved successfully',
      job
    });

  } catch (error) {
    console.error('Get job by ID error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        message: 'Invalid job ID',
        error: 'INVALID_JOB_ID'
      });
    }

    res.status(500).json({
      message: 'Failed to retrieve job',
      error: 'GET_JOB_ERROR'
    });
  }
};

// Get jobs posted by current recruiter
const getMyJobs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = { postedBy: req.user._id };

    // Status filter
    if (status) {
      filter.status = status;
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Calculate pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Execute query
    const jobs = await Job.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    // Get total count for pagination
    const totalJobs = await Job.countDocuments(filter);
    const totalPages = Math.ceil(totalJobs / limitNum);

    // Get status counts
    const statusCounts = await Job.aggregate([
      { $match: { postedBy: req.user._id } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const statusSummary = {
      active: 0,
      paused: 0,
      closed: 0,
      draft: 0
    };

    statusCounts.forEach(item => {
      statusSummary[item._id] = item.count;
    });

    res.status(200).json({
      message: 'Jobs retrieved successfully',
      jobs,
      statusSummary,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalJobs,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1
      }
    });

  } catch (error) {
    console.error('Get my jobs error:', error);
    res.status(500).json({
      message: 'Failed to retrieve jobs',
      error: 'GET_MY_JOBS_ERROR'
    });
  }
};

// Update job (Recruiters only - own jobs)
const updateJob = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { id } = req.params;

    // Find job and check ownership
    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({
        message: 'Job not found',
        error: 'JOB_NOT_FOUND'
      });
    }

    // Check if user owns this job
    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: 'You can only update your own jobs',
        error: 'UNAUTHORIZED_UPDATE'
      });
    }

    // Update job
    const updatedJob = await Job.findByIdAndUpdate(
      id,
      { ...req.body, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).populate('postedBy', 'firstName lastName email company');

    res.status(200).json({
      message: 'Job updated successfully',
      job: updatedJob
    });

  } catch (error) {
    console.error('Update job error:', error);
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message
      }));
      
      return res.status(400).json({
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    if (error.name === 'CastError') {
      return res.status(400).json({
        message: 'Invalid job ID',
        error: 'INVALID_JOB_ID'
      });
    }

    res.status(500).json({
      message: 'Failed to update job',
      error: 'UPDATE_JOB_ERROR'
    });
  }
};

// Delete job (Recruiters only - own jobs)
const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;

    // Find job and check ownership
    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({
        message: 'Job not found',
        error: 'JOB_NOT_FOUND'
      });
    }

    // Check if user owns this job
    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: 'You can only delete your own jobs',
        error: 'UNAUTHORIZED_DELETE'
      });
    }

    // Delete job
    await Job.findByIdAndDelete(id);

    res.status(200).json({
      message: 'Job deleted successfully'
    });

  } catch (error) {
    console.error('Delete job error:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        message: 'Invalid job ID',
        error: 'INVALID_JOB_ID'
      });
    }

    res.status(500).json({
      message: 'Failed to delete job',
      error: 'DELETE_JOB_ERROR'
    });
  }
};

// Get job statistics for dashboard
const getJobStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get basic counts
    const totalJobs = await Job.countDocuments({ postedBy: userId });
    const activeJobs = await Job.countDocuments({ postedBy: userId, status: 'active' });
    const draftJobs = await Job.countDocuments({ postedBy: userId, status: 'draft' });

    // Get total applications and views
    const stats = await Job.aggregate([
      { $match: { postedBy: userId } },
      {
        $group: {
          _id: null,
          totalApplications: { $sum: '$applicationCount' },
          totalViews: { $sum: '$viewCount' }
        }
      }
    ]);

    const { totalApplications = 0, totalViews = 0 } = stats[0] || {};

    // Get recent jobs
    const recentJobs = await Job.find({ postedBy: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title status applicationCount viewCount createdAt');

    res.status(200).json({
      message: 'Job statistics retrieved successfully',
      stats: {
        totalJobs,
        activeJobs,
        draftJobs,
        totalApplications,
        totalViews
      },
      recentJobs
    });

  } catch (error) {
    console.error('Get job stats error:', error);
    res.status(500).json({
      message: 'Failed to retrieve job statistics',
      error: 'GET_STATS_ERROR'
    });
  }
};

module.exports = {
  createJob,
  getJobs,
  getJobById,
  getMyJobs,
  updateJob,
  deleteJob,
  getJobStats
};
