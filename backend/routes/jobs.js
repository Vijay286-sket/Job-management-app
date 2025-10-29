const express = require('express');
const { body, query } = require('express-validator');
const {
  createJob,
  getJobs,
  getJobById,
  getMyJobs,
  updateJob,
  deleteJob,
  getJobStats
} = require('../controllers/jobController');
const { authenticateToken, requireRecruiter } = require('../middleware/auth');

const router = express.Router();

// Validation rules for job creation/update
const jobValidation = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Job title must be between 3 and 100 characters'),
  
  body('company')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Company name must be between 2 and 100 characters'),
  
  body('description')
    .trim()
    .isLength({ min: 50, max: 5000 })
    .withMessage('Job description must be between 50 and 5000 characters'),
  
  body('requirements')
    .trim()
    .isLength({ min: 10, max: 3000 })
    .withMessage('Job requirements must be between 10 and 3000 characters'),
  
  body('location')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Location must be between 2 and 100 characters'),
  
  body('jobType')
    .isIn(['full-time', 'part-time', 'contract', 'freelance', 'internship'])
    .withMessage('Job type must be one of: full-time, part-time, contract, freelance, internship'),
  
  body('experienceLevel')
    .isIn(['entry', 'mid', 'senior', 'executive'])
    .withMessage('Experience level must be one of: entry, mid, senior, executive'),
  
  body('salary.min')
    .optional()
    .isNumeric()
    .withMessage('Minimum salary must be a number')
    .custom((value) => {
      if (value < 0) {
        throw new Error('Minimum salary cannot be negative');
      }
      return true;
    }),
  
  body('salary.max')
    .optional()
    .isNumeric()
    .withMessage('Maximum salary must be a number')
    .custom((value, { req }) => {
      if (value < 0) {
        throw new Error('Maximum salary cannot be negative');
      }
      if (req.body.salary && req.body.salary.min && value < req.body.salary.min) {
        throw new Error('Maximum salary must be greater than or equal to minimum salary');
      }
      return true;
    }),
  
  body('salary.currency')
    .optional()
    .isIn(['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD'])
    .withMessage('Currency must be one of: USD, EUR, GBP, INR, CAD, AUD'),
  
  body('skills')
    .optional()
    .isArray()
    .withMessage('Skills must be an array')
    .custom((skills) => {
      if (skills.length > 20) {
        throw new Error('Cannot have more than 20 skills');
      }
      for (const skill of skills) {
        if (typeof skill !== 'string' || skill.trim().length === 0) {
          throw new Error('Each skill must be a non-empty string');
        }
        if (skill.length > 50) {
          throw new Error('Each skill cannot exceed 50 characters');
        }
      }
      return true;
    }),
  
  body('benefits')
    .optional()
    .isArray()
    .withMessage('Benefits must be an array')
    .custom((benefits) => {
      if (benefits.length > 15) {
        throw new Error('Cannot have more than 15 benefits');
      }
      for (const benefit of benefits) {
        if (typeof benefit !== 'string' || benefit.trim().length === 0) {
          throw new Error('Each benefit must be a non-empty string');
        }
        if (benefit.length > 100) {
          throw new Error('Each benefit cannot exceed 100 characters');
        }
      }
      return true;
    }),
  
  body('applicationDeadline')
    .optional()
    .isISO8601()
    .withMessage('Application deadline must be a valid date')
    .custom((value) => {
      if (new Date(value) <= new Date()) {
        throw new Error('Application deadline must be in the future');
      }
      return true;
    }),
  
  body('status')
    .optional()
    .isIn(['active', 'paused', 'closed', 'draft'])
    .withMessage('Status must be one of: active, paused, closed, draft'),
  
  body('remote')
    .optional()
    .isBoolean()
    .withMessage('Remote must be a boolean value'),
  
  body('featured')
    .optional()
    .isBoolean()
    .withMessage('Featured must be a boolean value')
];

// Validation rules for job search/filtering
const searchValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50'),
  
  query('minSalary')
    .optional()
    .isNumeric()
    .withMessage('Minimum salary must be a number'),
  
  query('maxSalary')
    .optional()
    .isNumeric()
    .withMessage('Maximum salary must be a number'),
  
  query('jobType')
    .optional()
    .isIn(['full-time', 'part-time', 'contract', 'freelance', 'internship'])
    .withMessage('Job type must be valid'),
  
  query('experienceLevel')
    .optional()
    .isIn(['entry', 'mid', 'senior', 'executive'])
    .withMessage('Experience level must be valid'),
  
  query('remote')
    .optional()
    .isBoolean()
    .withMessage('Remote must be a boolean value'),
  
  query('sortBy')
    .optional()
    .isIn(['createdAt', 'title', 'company', 'salary.min', 'applicationCount', 'viewCount'])
    .withMessage('Sort by must be a valid field'),
  
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be asc or desc')
];

// Public routes (accessible to all authenticated users)
router.get('/', authenticateToken, searchValidation, getJobs);
router.get('/:id', getJobById); // Public route for job details

// Recruiter-only routes
router.post('/', authenticateToken, requireRecruiter, jobValidation, createJob);
router.get('/my/jobs', authenticateToken, requireRecruiter, getMyJobs);
router.get('/my/stats', authenticateToken, requireRecruiter, getJobStats);
router.put('/:id', authenticateToken, requireRecruiter, jobValidation, updateJob);
router.delete('/:id', authenticateToken, requireRecruiter, deleteJob);

module.exports = router;
