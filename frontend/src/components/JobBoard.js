import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  MapPin, 
  Briefcase, 
  Clock, 
  DollarSign,
  Building,
  Filter,
  X
} from 'lucide-react';
import { jobService } from '../services/jobService';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const JobBoard = () => {
  const { user, isJobSeeker } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    loadJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadJobs = async (filters = {}) => {
    try {
      setLoading(true);
      const response = await jobService.getJobs({
        search: searchTerm,
        location: locationFilter,
        ...filters
      });
      setJobs(response.jobs);
      setPagination(response.pagination);
    } catch (error) {
      toast.error('Failed to load jobs');
      console.error('Load jobs error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadJobs();
  };

  const clearFilters = () => {
    setSearchTerm('');
    setLocationFilter('');
    loadJobs({});
  };

  const formatSalary = (job) => {
    if (!job.salary || (!job.salary.min && !job.salary.max)) return null;
    
    const formatAmount = (amount) => {
      if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)}M`;
      if (amount >= 1000) return `${(amount / 1000).toFixed(0)}K`;
      return amount.toString();
    };

    const currency = job.salary.currency || 'USD';
    if (job.salary.min && job.salary.max) {
      return `${formatAmount(job.salary.min)} - ${formatAmount(job.salary.max)} ${currency}`;
    } else if (job.salary.min) {
      return `${formatAmount(job.salary.min)}+ ${currency}`;
    } else {
      return `Up to ${formatAmount(job.salary.max)} ${currency}`;
    }
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const diffTime = Math.abs(now - new Date(date));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const JobCard = ({ job }) => (
    <Link 
      to={`/jobs/${job._id}`}
      className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6 border border-gray-200"
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{job.title}</h3>
          <div className="flex items-center text-gray-600 mb-2">
            <Building className="w-4 h-4 mr-1" />
            <span className="text-sm">{job.company}</span>
          </div>
        </div>
        {job.featured && (
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
            Featured
          </span>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
        <div className="flex items-center">
          <MapPin className="w-4 h-4 mr-1" />
          <span>{job.location}</span>
          {job.remote && <span className="ml-1 text-green-600">(Remote)</span>}
        </div>
        <div className="flex items-center">
          <Briefcase className="w-4 h-4 mr-1" />
          <span className="capitalize">{job.jobType.replace('-', ' ')}</span>
        </div>
        <div className="flex items-center">
          <Clock className="w-4 h-4 mr-1" />
          <span>{getTimeAgo(job.createdAt)}</span>
        </div>
      </div>

      {formatSalary(job) && (
        <div className="flex items-center text-green-600 font-medium mb-3">
          <DollarSign className="w-4 h-4 mr-1" />
          <span>{formatSalary(job)}</span>
        </div>
      )}

      <p className="text-gray-700 text-sm line-clamp-2 mb-3">
        {job.description.substring(0, 150)}...
      </p>

      {job.skills && job.skills.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {job.skills.slice(0, 3).map((skill, index) => (
            <span 
              key={index}
              className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
            >
              {skill}
            </span>
          ))}
          {job.skills.length > 3 && (
            <span className="text-xs text-gray-500">
              +{job.skills.length - 3} more
            </span>
          )}
        </div>
      )}
    </Link>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Find Your Next Job</h1>
              <p className="text-gray-600 mt-1">
                Discover opportunities that match your skills and interests
              </p>
            </div>
            {user && !isJobSeeker() && (
              <Link to="/jobs/post" className="btn btn-primary mt-4 md:mt-0">
                Post a Job
              </Link>
            )}
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search Input */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search jobs, companies, or keywords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-input pl-10 w-full"
                />
              </div>

              {/* Location Filter */}
              <div className="md:w-64 relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Location"
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="form-input pl-10 w-full"
                />
              </div>

              {/* Search Button */}
              <button type="submit" className="btn btn-primary whitespace-nowrap">
                Search Jobs
              </button>

              {/* Mobile Filter Toggle */}
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="btn btn-outline md:hidden"
              >
                <Filter className="w-4 h-4" />
              </button>
            </div>

            {/* Clear Filters */}
            {(searchTerm || locationFilter) && (
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  Showing results for: {searchTerm && `"${searchTerm}"`} 
                  {searchTerm && locationFilter && ' in '}
                  {locationFilter && `${locationFilter}`}
                </span>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                >
                  <X className="w-3 h-3 mr-1" />
                  Clear filters
                </button>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Job Listings */}
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <div className="loading-spinner mx-auto mb-4"></div>
              <p className="text-gray-600">Loading jobs...</p>
            </div>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-12">
            <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || locationFilter 
                ? 'Try adjusting your search criteria or location filter.'
                : 'No job postings are currently available.'
              }
            </p>
            {(searchTerm || locationFilter) && (
              <button onClick={clearFilters} className="btn btn-primary">
                View All Jobs
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium text-gray-900">
                {pagination.totalJobs} job{pagination.totalJobs !== 1 ? 's' : ''} found
              </h2>
            </div>

            {/* Job Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <div className="flex items-center space-x-2">
                  {pagination.hasPrevPage && (
                    <button
                      onClick={() => loadJobs({ page: pagination.currentPage - 1 })}
                      className="btn btn-outline"
                    >
                      Previous
                    </button>
                  )}
                  <span className="text-sm text-gray-600">
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </span>
                  {pagination.hasNextPage && (
                    <button
                      onClick={() => loadJobs({ page: pagination.currentPage + 1 })}
                      className="btn btn-outline"
                    >
                      Next
                    </button>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default JobBoard;
