import api from './authService';

export const jobService = {
  // Create new job (Recruiters only)
  createJob: async (jobData) => {
    try {
      const response = await api.post('/jobs', jobData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get all jobs with filtering and pagination
  getJobs: async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      // Add filters to query params
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
          queryParams.append(key, filters[key]);
        }
      });

      const response = await api.get(`/jobs?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get single job by ID
  getJobById: async (jobId) => {
    try {
      const response = await api.get(`/jobs/${jobId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get jobs posted by current recruiter
  getMyJobs: async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
          queryParams.append(key, filters[key]);
        }
      });

      const response = await api.get(`/jobs/my/jobs?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get job statistics for recruiter dashboard
  getJobStats: async () => {
    try {
      const response = await api.get('/jobs/my/stats');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update job (Recruiters only - own jobs)
  updateJob: async (jobId, jobData) => {
    try {
      const response = await api.put(`/jobs/${jobId}`, jobData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete job (Recruiters only - own jobs)
  deleteJob: async (jobId) => {
    try {
      const response = await api.delete(`/jobs/${jobId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Search jobs with text query
  searchJobs: async (searchQuery, filters = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (searchQuery) {
        queryParams.append('search', searchQuery);
      }

      Object.keys(filters).forEach(key => {
        if (filters[key] !== undefined && filters[key] !== null && filters[key] !== '') {
          queryParams.append(key, filters[key]);
        }
      });

      const response = await api.get(`/jobs?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get job options for form dropdowns
  getJobOptions: () => {
    return {
      jobTypes: [
        { value: 'full-time', label: 'Full Time' },
        { value: 'part-time', label: 'Part Time' },
        { value: 'contract', label: 'Contract' },
        { value: 'freelance', label: 'Freelance' },
        { value: 'internship', label: 'Internship' }
      ],
      experienceLevels: [
        { value: 'entry', label: 'Entry Level' },
        { value: 'mid', label: 'Mid Level' },
        { value: 'senior', label: 'Senior Level' },
        { value: 'executive', label: 'Executive' }
      ],
      currencies: [
        { value: 'USD', label: 'USD ($)' },
        { value: 'EUR', label: 'EUR (€)' },
        { value: 'GBP', label: 'GBP (£)' },
        { value: 'INR', label: 'INR (₹)' },
        { value: 'CAD', label: 'CAD (C$)' },
        { value: 'AUD', label: 'AUD (A$)' }
      ],
      statuses: [
        { value: 'active', label: 'Active' },
        { value: 'paused', label: 'Paused' },
        { value: 'closed', label: 'Closed' },
        { value: 'draft', label: 'Draft' }
      ]
    };
  }
};

export default jobService;
