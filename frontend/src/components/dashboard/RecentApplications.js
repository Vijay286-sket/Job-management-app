import React, { useState } from 'react';
import {
  Calendar,
  MapPin,
  DollarSign,
  Clock,
  Filter,
  Search,
  Eye,
  MessageSquare,
  ExternalLink,
  ChevronDown,
  Briefcase,
  Building
} from 'lucide-react';

const RecentApplications = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');

  // Mock application data
  const applications = [
    {
      id: 1,
      title: 'Senior Frontend Developer',
      company: 'TechCorp',
      logo: '🏢',
      status: 'interview',
      appliedDate: '2024-01-15',
      salary: '$85,000 - $100,000',
      location: 'Remote',
      type: 'Full-time',
      description: 'Join our dynamic team building next-generation web applications...',
      interviewDate: '2024-01-20',
      progress: 75
    },
    {
      id: 2,
      title: 'React Developer',
      company: 'StartupXYZ',
      logo: '🚀',
      status: 'pending',
      appliedDate: '2024-01-10',
      salary: '$70,000 - $85,000',
      location: 'New York, NY',
      type: 'Full-time',
      description: 'We are looking for a passionate React developer to join our growing team...',
      progress: 25
    },
    {
      id: 3,
      title: 'Full Stack Engineer',
      company: 'BigTech Inc',
      logo: '💻',
      status: 'under_review',
      appliedDate: '2024-01-05',
      salary: '$90,000 - $110,000',
      location: 'San Francisco, CA',
      type: 'Full-time',
      description: 'Build scalable applications using modern technologies...',
      progress: 50
    },
    {
      id: 4,
      title: 'UI/UX Designer',
      company: 'DesignStudio',
      logo: '🎨',
      status: 'rejected',
      appliedDate: '2024-01-01',
      salary: '$65,000 - $80,000',
      location: 'Los Angeles, CA',
      type: 'Contract',
      description: 'Create beautiful and intuitive user experiences...',
      progress: 100,
      feedback: 'Thank you for your interest. We decided to move forward with another candidate.'
    },
    {
      id: 5,
      title: 'DevOps Engineer',
      company: 'CloudFirst',
      logo: '☁️',
      status: 'accepted',
      appliedDate: '2023-12-20',
      salary: '$95,000 - $120,000',
      location: 'Austin, TX',
      type: 'Full-time',
      description: 'Manage cloud infrastructure and deployment pipelines...',
      progress: 100,
      startDate: '2024-02-01'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'interview':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'under_review':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'accepted':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'interview':
        return <Calendar className="w-4 h-4" />;
      case 'under_review':
        return <Eye className="w-4 h-4" />;
      case 'rejected':
        return <span className="text-red-500">✕</span>;
      case 'accepted':
        return <span className="text-green-500">✓</span>;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const ProgressBar = ({ value, status }) => {
    const getProgressColor = () => {
      if (status === 'rejected') return 'bg-red-500';
      if (status === 'accepted') return 'bg-green-500';
      return 'bg-blue-500';
    };

    return (
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className={`${getProgressColor()} h-2 rounded-full transition-all duration-500`}
          style={{ width: `${value}%` }}
        ></div>
      </div>
    );
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">My Applications</h2>
            <p className="text-gray-600 mt-1">Track and manage your job applications</p>
          </div>
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{applications.length}</div>
              <div className="text-sm text-gray-500">Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {applications.filter(app => app.status === 'pending').length}
              </div>
              <div className="text-sm text-gray-500">Pending</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {applications.filter(app => app.status === 'interview').length}
              </div>
              <div className="text-sm text-gray-500">Interviews</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {applications.filter(app => app.status === 'accepted').length}
              </div>
              <div className="text-sm text-gray-500">Accepted</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search applications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="interview">Interview</option>
              <option value="under_review">Under Review</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>
            <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          {/* Sort */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="date">Sort by Date</option>
              <option value="company">Sort by Company</option>
              <option value="status">Sort by Status</option>
            </select>
            <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApplications.map((application) => (
          <div key={application.id} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  {/* Company Logo */}
                  <div className="text-3xl">{application.logo}</div>
                  
                  {/* Job Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {application.title}
                        </h3>
                        <div className="flex items-center text-gray-600 mb-2">
                          <Building className="w-4 h-4 mr-1" />
                          <span className="font-medium">{application.company}</span>
                        </div>
                      </div>
                      
                      {/* Status Badge */}
                      <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(application.status)}`}>
                        {getStatusIcon(application.status)}
                        <span className="capitalize">{application.status.replace('_', ' ')}</span>
                      </div>
                    </div>

                    {/* Job Info */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-3">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        Applied {application.appliedDate}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {application.location}
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-1" />
                        {application.salary}
                      </div>
                      <div className="flex items-center">
                        <Briefcase className="w-4 h-4 mr-1" />
                        {application.type}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-3">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Application Progress</span>
                        <span>{application.progress}%</span>
                      </div>
                      <ProgressBar value={application.progress} status={application.status} />
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {application.description}
                    </p>

                    {/* Special Messages */}
                    {application.interviewDate && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                        <div className="flex items-center text-blue-800">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span className="font-medium">Interview scheduled for {application.interviewDate}</span>
                        </div>
                      </div>
                    )}

                    {application.feedback && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                        <p className="text-red-800 text-sm">{application.feedback}</p>
                      </div>
                    )}

                    {application.startDate && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                        <div className="flex items-center text-green-800">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span className="font-medium">Start date: {application.startDate}</span>
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center space-x-3">
                      <button className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm font-medium">
                        <Eye className="w-4 h-4" />
                        <span>View Details</span>
                      </button>
                      <button className="flex items-center space-x-1 text-gray-600 hover:text-gray-700 text-sm font-medium">
                        <MessageSquare className="w-4 h-4" />
                        <span>Message</span>
                      </button>
                      <button className="flex items-center space-x-1 text-gray-600 hover:text-gray-700 text-sm font-medium">
                        <ExternalLink className="w-4 h-4" />
                        <span>View Job</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredApplications.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  );
};

export default RecentApplications;
