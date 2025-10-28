import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft,
  MapPin, 
  Briefcase, 
  Clock, 
  DollarSign,
  Building,
  Users,
  Edit3,
  ExternalLink,
  Heart,
  Share2
} from 'lucide-react';
import { jobService } from '../services/jobService';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isJobSeeker } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    loadJob();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadJob = async () => {
    try {
      setLoading(true);
      const response = await jobService.getJobById(id);
      setJob(response.job);
    } catch (error) {
      toast.error('Job not found');
      navigate('/jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!user) {
      toast.error('Please login to apply for jobs');
      navigate('/login');
      return;
    }

    if (!isJobSeeker()) {
      toast.error('Only job seekers can apply for jobs');
      return;
    }

    try {
      setApplying(true);
      // In a real app, this would create an application record
      // For now, we'll just show a success message
      toast.success('Application submitted successfully!');
      
      // Increment application count (simulate)
      setJob(prev => ({
        ...prev,
        applicationCount: (prev.applicationCount || 0) + 1
      }));
    } catch (error) {
      toast.error('Failed to submit application');
    } finally {
      setApplying(false);
    }
  };

  const formatSalary = () => {
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

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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

  const isJobOwner = user && job && job.postedBy._id === user.id;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Job Not Found</h2>
          <p className="text-gray-600 mb-4">The job you're looking for doesn't exist.</p>
          <Link to="/jobs" className="btn btn-primary">
            Browse Jobs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              {/* Job Header */}
              <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{job.title}</h1>
                  <div className="flex items-center text-gray-600 mb-3">
                    <Building className="w-5 h-5 mr-2" />
                    <span className="text-lg">{job.company}</span>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
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
                      <span>Posted {getTimeAgo(job.createdAt)}</span>
                    </div>
                  </div>
                </div>

                {job.featured && (
                  <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full mt-4 md:mt-0">
                    Featured Job
                  </span>
                )}
              </div>

              {/* Salary */}
              {formatSalary() && (
                <div className="flex items-center text-green-600 font-semibold text-lg mb-6">
                  <DollarSign className="w-5 h-5 mr-1" />
                  <span>{formatSalary()}</span>
                </div>
              )}

              {/* Job Description */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Description</h2>
                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
                </div>
              </div>

              {/* Requirements */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Requirements</h2>
                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-line">{job.requirements}</p>
                </div>
              </div>

              {/* Skills */}
              {job.skills && job.skills.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Required Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.map((skill, index) => (
                      <span 
                        key={index}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Benefits */}
              {job.benefits && job.benefits.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Benefits</h2>
                  <ul className="list-disc list-inside space-y-1">
                    {job.benefits.map((benefit, index) => (
                      <li key={index} className="text-gray-700">{benefit}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-8">
              {/* Apply Button */}
              {!isJobOwner && (
                <div className="mb-6">
                  {isJobSeeker() ? (
                    <button
                      onClick={handleApply}
                      disabled={applying}
                      className="btn btn-primary w-full"
                    >
                      {applying ? (
                        <>
                          <div className="loading-spinner mr-2"></div>
                          Applying...
                        </>
                      ) : (
                        'Apply Now'
                      )}
                    </button>
                  ) : (
                    <div className="text-center">
                      <p className="text-gray-600 text-sm mb-3">
                        {user ? 'Switch to job seeker account to apply' : 'Login to apply for this job'}
                      </p>
                      {!user && (
                        <Link to="/login" className="btn btn-primary w-full">
                          Login to Apply
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Owner Actions */}
              {isJobOwner && (
                <div className="mb-6">
                  <Link
                    to={`/jobs/${job._id}/edit`}
                    className="btn btn-primary w-full mb-3"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit Job
                  </Link>
                  <Link
                    to="/jobs/manage"
                    className="btn btn-outline w-full"
                  >
                    Manage All Jobs
                  </Link>
                </div>
              )}

              {/* Job Stats */}
              <div className="border-t pt-6 mb-6">
                <h3 className="font-semibold text-gray-900 mb-4">Job Statistics</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-600">
                      <Users className="w-4 h-4 mr-2" />
                      <span className="text-sm">Applications</span>
                    </div>
                    <span className="font-medium">{job.applicationCount || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-600">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      <span className="text-sm">Views</span>
                    </div>
                    <span className="font-medium">{job.viewCount || 0}</span>
                  </div>
                </div>
              </div>

              {/* Job Details */}
              <div className="border-t pt-6">
                <h3 className="font-semibold text-gray-900 mb-4">Job Details</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-gray-600">Experience Level:</span>
                    <span className="ml-2 capitalize">{job.experienceLevel} Level</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Posted:</span>
                    <span className="ml-2">{formatDate(job.createdAt)}</span>
                  </div>
                  {job.applicationDeadline && (
                    <div>
                      <span className="text-gray-600">Deadline:</span>
                      <span className="ml-2">{formatDate(job.applicationDeadline)}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-gray-600">Status:</span>
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                      job.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {job.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Share Actions */}
              <div className="border-t pt-6 mt-6">
                <div className="flex items-center space-x-2">
                  <button className="flex-1 btn btn-outline text-sm">
                    <Heart className="w-4 h-4 mr-1" />
                    Save
                  </button>
                  <button className="flex-1 btn btn-outline text-sm">
                    <Share2 className="w-4 h-4 mr-1" />
                    Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
