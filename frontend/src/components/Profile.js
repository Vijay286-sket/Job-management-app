import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { 
  User, 
  Mail, 
  Shield, 
  Edit3, 
  Save, 
  X,
  CheckCircle,
  Clock,
  Briefcase
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
  const { user, updateProfile, loading, isRecruiter } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError
  } = useForm({
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || ''
    }
  });

  const onSubmit = async (data) => {
    const result = await updateProfile(data);
    
    if (result.success) {
      setIsEditing(false);
    } else {
      setError('root', {
        type: 'manual',
        message: result.error
      });
    }
  };

  const handleCancel = () => {
    reset({
      firstName: user?.firstName || '',
      lastName: user?.lastName || ''
    });
    setIsEditing(false);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getRoleBadgeColor = (role) => {
    return role === 'recruiter' 
      ? 'bg-purple-100 text-purple-800' 
      : 'bg-blue-100 text-blue-800';
  };

  const getVerificationStatus = () => {
    return user?.isEmailVerified ? (
      <div className="flex items-center space-x-1 text-green-600">
        <CheckCircle className="w-4 h-4" />
        <span className="text-sm">Verified</span>
      </div>
    ) : (
      <div className="flex items-center space-x-1 text-orange-600">
        <Clock className="w-4 h-4" />
        <span className="text-sm">Pending Verification</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Settings</h1>
          <p className="text-gray-600">
            Manage your account information and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-center">
                {/* Avatar */}
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </span>
                </div>

                {/* User Info */}
                <h2 className="text-xl font-semibold text-gray-900 mb-1">
                  {user?.fullName}
                </h2>
                <p className="text-gray-600 mb-3">{user?.email}</p>

                {/* Role Badge */}
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRoleBadgeColor(user?.role)}`}>
                  {user?.role === 'recruiter' ? (
                    <>
                      <Briefcase className="w-3 h-3 mr-1" />
                      Recruiter
                    </>
                  ) : (
                    <>
                      <User className="w-3 h-3 mr-1" />
                      Job Seeker
                    </>
                  )}
                </span>

                {/* Verification Status */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  {getVerificationStatus()}
                </div>
              </div>
            </div>

            {/* Account Stats */}
            <div className="bg-white rounded-lg shadow p-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Member Since</span>
                  <span className="text-gray-900 font-medium">
                    {user?.createdAt ? formatDate(user.createdAt) : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Last Login</span>
                  <span className="text-gray-900 font-medium">
                    {user?.lastLogin ? formatDate(user.lastLogin) : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Profile Status</span>
                  <span className={`font-medium ${user?.profileCompleted ? 'text-green-600' : 'text-orange-600'}`}>
                    {user?.profileCompleted ? 'Complete' : 'Incomplete'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow">
              {/* Form Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Personal Information
                  </h3>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="btn btn-outline"
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit Profile
                    </button>
                  ) : (
                    <div className="flex space-x-2">
                      <button
                        onClick={handleCancel}
                        className="btn btn-secondary"
                        disabled={isSubmitting}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </button>
                      <button
                        onClick={handleSubmit(onSubmit)}
                        disabled={isSubmitting || loading}
                        className="btn btn-primary"
                      >
                        {isSubmitting || loading ? (
                          <>
                            <div className="loading-spinner mr-2"></div>
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            Save Changes
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Form Content */}
              <div className="p-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Root error */}
                  {errors.root && (
                    <div className="alert alert-error">
                      {errors.root.message}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* First Name */}
                    <div className="form-group">
                      <label htmlFor="firstName" className="form-label">
                        First Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                          id="firstName"
                          type="text"
                          disabled={!isEditing}
                          className={`form-input pl-10 ${errors.firstName ? 'error' : ''} ${!isEditing ? 'bg-gray-50' : ''}`}
                          placeholder="Enter your first name"
                          {...register('firstName', {
                            required: 'First name is required',
                            minLength: {
                              value: 2,
                              message: 'First name must be at least 2 characters'
                            },
                            maxLength: {
                              value: 50,
                              message: 'First name cannot exceed 50 characters'
                            },
                            pattern: {
                              value: /^[a-zA-Z\s]+$/,
                              message: 'First name can only contain letters and spaces'
                            }
                          })}
                        />
                      </div>
                      {errors.firstName && (
                        <p className="form-error">{errors.firstName.message}</p>
                      )}
                    </div>

                    {/* Last Name */}
                    <div className="form-group">
                      <label htmlFor="lastName" className="form-label">
                        Last Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                          id="lastName"
                          type="text"
                          disabled={!isEditing}
                          className={`form-input pl-10 ${errors.lastName ? 'error' : ''} ${!isEditing ? 'bg-gray-50' : ''}`}
                          placeholder="Enter your last name"
                          {...register('lastName', {
                            required: 'Last name is required',
                            minLength: {
                              value: 2,
                              message: 'Last name must be at least 2 characters'
                            },
                            maxLength: {
                              value: 50,
                              message: 'Last name cannot exceed 50 characters'
                            },
                            pattern: {
                              value: /^[a-zA-Z\s]+$/,
                              message: 'Last name can only contain letters and spaces'
                            }
                          })}
                        />
                      </div>
                      {errors.lastName && (
                        <p className="form-error">{errors.lastName.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Email (Read-only) */}
                  <div className="form-group">
                    <label htmlFor="email" className="form-label">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        id="email"
                        type="email"
                        disabled
                        value={user?.email || ''}
                        className="form-input pl-10 bg-gray-50"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Email address cannot be changed. Contact support if needed.
                    </p>
                  </div>

                  {/* Role (Read-only) */}
                  <div className="form-group">
                    <label htmlFor="role" className="form-label">
                      Account Type
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Shield className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        id="role"
                        type="text"
                        disabled
                        value={user?.role === 'recruiter' ? 'Recruiter' : 'Job Seeker'}
                        className="form-input pl-10 bg-gray-50"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Account type cannot be changed after registration.
                    </p>
                  </div>
                </form>
              </div>
            </div>

            {/* Role-specific Information */}
            <div className="bg-white rounded-lg shadow mt-6">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  {isRecruiter() ? 'Recruiter Information' : 'Job Seeker Information'}
                </h3>
              </div>
              <div className="p-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <Briefcase className="w-5 h-5 text-blue-600 mt-0.5" />
                    </div>
                    <div className="ml-3">
                      <h4 className="text-sm font-medium text-blue-900">
                        {isRecruiter() ? 'Company Profile Setup' : 'Complete Your Profile'}
                      </h4>
                      <p className="text-sm text-blue-700 mt-1">
                        {isRecruiter() 
                          ? 'Set up your company information to start posting jobs and attracting candidates.'
                          : 'Complete your profile with skills, experience, and preferences to get better job matches.'
                        }
                      </p>
                      <button className="btn btn-primary mt-3 text-sm">
                        {isRecruiter() ? 'Setup Company Profile' : 'Complete Profile'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
