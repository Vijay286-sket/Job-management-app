import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  Users, 
  Calendar,
  MoreVertical,
  Play,
  Pause,
  X
} from 'lucide-react';
import { jobService } from '../services/jobService';
import toast from 'react-hot-toast';

const JobManagement = () => {
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({ show: false, job: null });
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [jobsResponse, statsResponse] = await Promise.all([
        jobService.getMyJobs(),
        jobService.getJobStats()
      ]);
      setJobs(jobsResponse.jobs);
      setStats(statsResponse.stats);
    } catch (error) {
      toast.error('Failed to load job data');
      console.error('Load data error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (jobId, newStatus) => {
    try {
      setActionLoading(jobId);
      await jobService.updateJob(jobId, { status: newStatus });
      toast.success(`Job ${newStatus === 'active' ? 'activated' : 'paused'} successfully`);
      loadData();
    } catch (error) {
      toast.error('Failed to update job status');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async () => {
    try {
      setActionLoading(deleteModal.job._id);
      await jobService.deleteJob(deleteModal.job._id);
      toast.success('Job deleted successfully');
      setDeleteModal({ show: false, job: null });
      loadData();
    } catch (error) {
      toast.error('Failed to delete job');
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'closed': return 'bg-red-100 text-red-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const JobCard = ({ job }) => {
    const [showActions, setShowActions] = useState(false);

    return (
      <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{job.title}</h3>
            <p className="text-gray-600 text-sm">{job.company} • {job.location}</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
              {job.status}
            </span>
            <div className="relative">
              <button
                onClick={() => setShowActions(!showActions)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <MoreVertical className="w-4 h-4 text-gray-500" />
              </button>
              
              {showActions && (
                <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg border z-10">
                  <Link
                    to={`/jobs/${job._id}`}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setShowActions(false)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Job
                  </Link>
                  <Link
                    to={`/jobs/${job._id}/edit`}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setShowActions(false)}
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit Job
                  </Link>
                  {job.status === 'active' ? (
                    <button
                      onClick={() => {
                        handleStatusChange(job._id, 'paused');
                        setShowActions(false);
                      }}
                      disabled={actionLoading === job._id}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Pause className="w-4 h-4 mr-2" />
                      Pause Job
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        handleStatusChange(job._id, 'active');
                        setShowActions(false);
                      }}
                      disabled={actionLoading === job._id}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Activate Job
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setDeleteModal({ show: true, job });
                      setShowActions(false);
                    }}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Job
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="flex items-center justify-center text-blue-600 mb-1">
              <Eye className="w-4 h-4 mr-1" />
              <span className="font-semibold">{job.viewCount || 0}</span>
            </div>
            <p className="text-xs text-gray-600">Views</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center text-green-600 mb-1">
              <Users className="w-4 h-4 mr-1" />
              <span className="font-semibold">{job.applicationCount || 0}</span>
            </div>
            <p className="text-xs text-gray-600">Applications</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center text-gray-600 mb-1">
              <Calendar className="w-4 h-4 mr-1" />
              <span className="font-semibold text-xs">{formatDate(job.createdAt)}</span>
            </div>
            <p className="text-xs text-gray-600">Posted</p>
          </div>
        </div>

        <p className="text-gray-700 text-sm line-clamp-2">
          {job.description.substring(0, 120)}...
        </p>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Job Management</h1>
              <p className="text-gray-600 mt-1">Manage your job postings and track performance</p>
            </div>
            <Link to="/jobs/post" className="btn btn-primary mt-4 md:mt-0">
              <Plus className="w-4 h-4 mr-2" />
              Post New Job
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.totalJobs || 0}</div>
            <div className="text-sm text-gray-600">Total Jobs</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.activeJobs || 0}</div>
            <div className="text-sm text-gray-600">Active Jobs</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.totalApplications || 0}</div>
            <div className="text-sm text-gray-600">Applications</div>
          </div>
          <div className="bg-white rounded-lg shadow p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{stats.totalViews || 0}</div>
            <div className="text-sm text-gray-600">Total Views</div>
          </div>
        </div>

        {/* Job Listings */}
        {jobs.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-lg shadow p-8">
              <Plus className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs posted yet</h3>
              <p className="text-gray-600 mb-4">
                Start by posting your first job to attract qualified candidates.
              </p>
              <Link to="/jobs/post" className="btn btn-primary">
                Post Your First Job
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium text-gray-900">
                Your Jobs ({jobs.length})
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Delete Job</h3>
              <button
                onClick={() => setDeleteModal({ show: false, job: null })}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{deleteModal.job?.title}"? This action cannot be undone.
            </p>
            
            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => setDeleteModal({ show: false, job: null })}
                className="btn btn-secondary"
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={actionLoading}
                className="btn bg-red-600 text-white hover:bg-red-700"
              >
                {actionLoading ? (
                  <>
                    <div className="loading-spinner mr-2"></div>
                    Deleting...
                  </>
                ) : (
                  'Delete Job'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobManagement;
