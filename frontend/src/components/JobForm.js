import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { 
  Briefcase, 
  Building, 
  MapPin, 
  DollarSign, 
  Calendar, 
  Plus, 
  X, 
  Save,
  ArrowLeft
} from 'lucide-react';
import { jobService } from '../services/jobService';
import toast from 'react-hot-toast';

const JobForm = ({ mode = 'create' }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(mode === 'edit');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
    setError,
    reset
  } = useForm({
    defaultValues: {
      title: '',
      company: '',
      description: '',
      requirements: '',
      location: '',
      jobType: 'full-time',
      experienceLevel: 'mid',
      salary: {
        min: '',
        max: '',
        currency: 'USD'
      },
      skills: [],
      benefits: [],
      applicationDeadline: '',
      status: 'active',
      remote: false,
      featured: false
    }
  });

  const { fields: skillFields, append: appendSkill, remove: removeSkill } = useFieldArray({
    control,
    name: 'skills'
  });

  const { fields: benefitFields, append: appendBenefit, remove: removeBenefit } = useFieldArray({
    control,
    name: 'benefits'
  });

  const jobOptions = jobService.getJobOptions();

  // Load job data for editing
  useEffect(() => {
    if (mode === 'edit' && id) {
      loadJobData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, id]);

  const loadJobData = async () => {
    try {
      setInitialLoading(true);
      const response = await jobService.getJobById(id);
      const job = response.job;

      // Format data for form
      const formData = {
        ...job,
        skills: job.skills || [],
        benefits: job.benefits || [],
        applicationDeadline: job.applicationDeadline 
          ? new Date(job.applicationDeadline).toISOString().split('T')[0] 
          : '',
        salary: {
          min: job.salary?.min || '',
          max: job.salary?.max || '',
          currency: job.salary?.currency || 'USD'
        }
      };

      reset(formData);
    } catch (error) {
      toast.error('Failed to load job data');
      navigate('/jobs/manage');
    } finally {
      setInitialLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      // Clean up data
      const jobData = {
        ...data,
        skills: data.skills.filter(skill => skill.trim() !== ''),
        benefits: data.benefits.filter(benefit => benefit.trim() !== ''),
        salary: {
          min: data.salary.min ? parseInt(data.salary.min) : undefined,
          max: data.salary.max ? parseInt(data.salary.max) : undefined,
          currency: data.salary.currency
        }
      };

      // Remove empty salary object if no values
      if (!jobData.salary.min && !jobData.salary.max) {
        delete jobData.salary;
      }

      if (mode === 'edit') {
        await jobService.updateJob(id, jobData);
        toast.success('Job updated successfully!');
      } else {
        await jobService.createJob(jobData);
        toast.success('Job posted successfully!');
      }

      navigate('/jobs/manage');

    } catch (error) {
      let errorMessage = mode === 'edit' ? 'Failed to update job' : 'Failed to create job';
      
      if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        errorMessage = error.response.data.errors.map(err => err.msg || err.message).join(', ');
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      toast.error(errorMessage);
      setError('root', { type: 'manual', message: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const addSkill = () => {
    appendSkill('');
  };

  const addBenefit = () => {
    appendBenefit('');
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-600">Loading job data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/jobs/manage')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Job Management
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            {mode === 'edit' ? 'Edit Job Posting' : 'Post New Job'}
          </h1>
          <p className="text-gray-600 mt-2">
            {mode === 'edit' 
              ? 'Update your job posting details' 
              : 'Fill in the details to create a new job posting'
            }
          </p>
        </div>

        <div className="bg-white rounded-lg shadow">
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
            {/* Root error */}
            {errors.root && (
              <div className="alert alert-error">
                {errors.root.message}
              </div>
            )}

            {/* Basic Information */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">
                Basic Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Job Title */}
                <div className="form-group">
                  <label htmlFor="title" className="form-label">
                    Job Title *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Briefcase className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      id="title"
                      type="text"
                      className={`form-input pl-10 ${errors.title ? 'error' : ''}`}
                      placeholder="e.g. Senior Frontend Developer"
                      {...register('title', {
                        required: 'Job title is required',
                        minLength: { value: 3, message: 'Title must be at least 3 characters' },
                        maxLength: { value: 100, message: 'Title cannot exceed 100 characters' }
                      })}
                    />
                  </div>
                  {errors.title && <p className="form-error">{errors.title.message}</p>}
                </div>

                {/* Company */}
                <div className="form-group">
                  <label htmlFor="company" className="form-label">
                    Company *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Building className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      id="company"
                      type="text"
                      className={`form-input pl-10 ${errors.company ? 'error' : ''}`}
                      placeholder="e.g. TechCorp Inc."
                      {...register('company', {
                        required: 'Company name is required',
                        minLength: { value: 2, message: 'Company name must be at least 2 characters' },
                        maxLength: { value: 100, message: 'Company name cannot exceed 100 characters' }
                      })}
                    />
                  </div>
                  {errors.company && <p className="form-error">{errors.company.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Location */}
                <div className="form-group">
                  <label htmlFor="location" className="form-label">
                    Location *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      id="location"
                      type="text"
                      className={`form-input pl-10 ${errors.location ? 'error' : ''}`}
                      placeholder="e.g. San Francisco, CA"
                      {...register('location', {
                        required: 'Location is required',
                        minLength: { value: 2, message: 'Location must be at least 2 characters' },
                        maxLength: { value: 100, message: 'Location cannot exceed 100 characters' }
                      })}
                    />
                  </div>
                  {errors.location && <p className="form-error">{errors.location.message}</p>}
                </div>

                {/* Remote Work */}
                <div className="form-group">
                  <label className="form-label">Work Type</label>
                  <div className="flex items-center space-x-4 mt-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="mr-2"
                        {...register('remote')}
                      />
                      <span className="text-sm">Remote Work Available</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Job Type */}
                <div className="form-group">
                  <label htmlFor="jobType" className="form-label">
                    Job Type *
                  </label>
                  <select
                    id="jobType"
                    className={`form-select ${errors.jobType ? 'error' : ''}`}
                    {...register('jobType', { required: 'Job type is required' })}
                  >
                    {jobOptions.jobTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  {errors.jobType && <p className="form-error">{errors.jobType.message}</p>}
                </div>

                {/* Experience Level */}
                <div className="form-group">
                  <label htmlFor="experienceLevel" className="form-label">
                    Experience Level *
                  </label>
                  <select
                    id="experienceLevel"
                    className={`form-select ${errors.experienceLevel ? 'error' : ''}`}
                    {...register('experienceLevel', { required: 'Experience level is required' })}
                  >
                    {jobOptions.experienceLevels.map(level => (
                      <option key={level.value} value={level.value}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                  {errors.experienceLevel && <p className="form-error">{errors.experienceLevel.message}</p>}
                </div>
              </div>
            </div>

            {/* Job Description */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">
                Job Details
              </h2>

              {/* Description */}
              <div className="form-group">
                <label htmlFor="description" className="form-label">
                  Job Description *
                </label>
                <textarea
                  id="description"
                  rows={6}
                  className={`form-input ${errors.description ? 'error' : ''}`}
                  placeholder="Describe the role, responsibilities, and what makes this position exciting..."
                  {...register('description', {
                    required: 'Job description is required',
                    minLength: { value: 50, message: 'Description must be at least 50 characters' },
                    maxLength: { value: 5000, message: 'Description cannot exceed 5000 characters' }
                  })}
                />
                {errors.description && <p className="form-error">{errors.description.message}</p>}
              </div>

              {/* Requirements */}
              <div className="form-group">
                <label htmlFor="requirements" className="form-label">
                  Requirements *
                </label>
                <textarea
                  id="requirements"
                  rows={4}
                  className={`form-input ${errors.requirements ? 'error' : ''}`}
                  placeholder="List the required skills, experience, and qualifications..."
                  {...register('requirements', {
                    required: 'Job requirements are required',
                    minLength: { value: 10, message: 'Requirements must be at least 10 characters' },
                    maxLength: { value: 3000, message: 'Requirements cannot exceed 3000 characters' }
                  })}
                />
                {errors.requirements && <p className="form-error">{errors.requirements.message}</p>}
              </div>
            </div>

            {/* Salary Information */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">
                Compensation
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="form-group">
                  <label htmlFor="salary.min" className="form-label">
                    Minimum Salary
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DollarSign className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      id="salary.min"
                      type="number"
                      className={`form-input pl-10 ${errors.salary?.min ? 'error' : ''}`}
                      placeholder="50000"
                      {...register('salary.min', {
                        min: { value: 0, message: 'Salary cannot be negative' }
                      })}
                    />
                  </div>
                  {errors.salary?.min && <p className="form-error">{errors.salary.min.message}</p>}
                </div>

                <div className="form-group">
                  <label htmlFor="salary.max" className="form-label">
                    Maximum Salary
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <DollarSign className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      id="salary.max"
                      type="number"
                      className={`form-input pl-10 ${errors.salary?.max ? 'error' : ''}`}
                      placeholder="80000"
                      {...register('salary.max', {
                        min: { value: 0, message: 'Salary cannot be negative' }
                      })}
                    />
                  </div>
                  {errors.salary?.max && <p className="form-error">{errors.salary.max.message}</p>}
                </div>

                <div className="form-group">
                  <label htmlFor="salary.currency" className="form-label">
                    Currency
                  </label>
                  <select
                    id="salary.currency"
                    className="form-select"
                    {...register('salary.currency')}
                  >
                    {jobOptions.currencies.map(currency => (
                      <option key={currency.value} value={currency.value}>
                        {currency.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Required Skills</h2>
                <button
                  type="button"
                  onClick={addSkill}
                  className="btn btn-outline btn-sm"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Skill
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {skillFields.map((field, index) => (
                  <div key={field.id} className="flex items-center space-x-2">
                    <input
                      type="text"
                      className="form-input flex-1"
                      placeholder="e.g. React, Node.js, Python"
                      {...register(`skills.${index}`, {
                        maxLength: { value: 50, message: 'Skill cannot exceed 50 characters' }
                      })}
                    />
                    <button
                      type="button"
                      onClick={() => removeSkill(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Benefits */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Benefits</h2>
                <button
                  type="button"
                  onClick={addBenefit}
                  className="btn btn-outline btn-sm"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Benefit
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {benefitFields.map((field, index) => (
                  <div key={field.id} className="flex items-center space-x-2">
                    <input
                      type="text"
                      className="form-input flex-1"
                      placeholder="e.g. Health Insurance, Flexible Hours"
                      {...register(`benefits.${index}`, {
                        maxLength: { value: 100, message: 'Benefit cannot exceed 100 characters' }
                      })}
                    />
                    <button
                      type="button"
                      onClick={() => removeBenefit(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Settings */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">
                Additional Settings
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Application Deadline */}
                <div className="form-group">
                  <label htmlFor="applicationDeadline" className="form-label">
                    Application Deadline
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      id="applicationDeadline"
                      type="date"
                      className={`form-input pl-10 ${errors.applicationDeadline ? 'error' : ''}`}
                      {...register('applicationDeadline')}
                    />
                  </div>
                  {errors.applicationDeadline && <p className="form-error">{errors.applicationDeadline.message}</p>}
                </div>

                {/* Status */}
                <div className="form-group">
                  <label htmlFor="status" className="form-label">
                    Status
                  </label>
                  <select
                    id="status"
                    className="form-select"
                    {...register('status')}
                  >
                    {jobOptions.statuses.map(status => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Featured Job */}
              <div className="form-group">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2"
                    {...register('featured')}
                  />
                  <span className="text-sm font-medium">Featured Job (appears at top of listings)</span>
                </label>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex items-center justify-end space-x-4 pt-6 border-t">
              <button
                type="button"
                onClick={() => navigate('/jobs/manage')}
                className="btn btn-secondary"
                disabled={isSubmitting || loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || loading}
                className="btn btn-primary"
              >
                {isSubmitting || loading ? (
                  <>
                    <div className="loading-spinner mr-2"></div>
                    {mode === 'edit' ? 'Updating...' : 'Posting...'}
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {mode === 'edit' ? 'Update Job' : 'Post Job'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JobForm;
