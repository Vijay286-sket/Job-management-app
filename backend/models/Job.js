const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true,
    maxlength: [100, 'Job title cannot exceed 100 characters'],
    minlength: [3, 'Job title must be at least 3 characters']
  },
  company: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
    maxlength: [100, 'Company name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Job description is required'],
    trim: true,
    maxlength: [5000, 'Job description cannot exceed 5000 characters'],
    minlength: [50, 'Job description must be at least 50 characters']
  },
  requirements: {
    type: String,
    required: [true, 'Job requirements are required'],
    trim: true,
    maxlength: [3000, 'Job requirements cannot exceed 3000 characters']
  },
  location: {
    type: String,
    required: [true, 'Job location is required'],
    trim: true,
    maxlength: [100, 'Location cannot exceed 100 characters']
  },
  jobType: {
    type: String,
    required: [true, 'Job type is required'],
    enum: {
      values: ['full-time', 'part-time', 'contract', 'freelance', 'internship'],
      message: 'Job type must be one of: full-time, part-time, contract, freelance, internship'
    }
  },
  experienceLevel: {
    type: String,
    required: [true, 'Experience level is required'],
    enum: {
      values: ['entry', 'mid', 'senior', 'executive'],
      message: 'Experience level must be one of: entry, mid, senior, executive'
    }
  },
  salary: {
    min: {
      type: Number,
      min: [0, 'Minimum salary cannot be negative']
    },
    max: {
      type: Number,
      min: [0, 'Maximum salary cannot be negative'],
      validate: {
        validator: function(value) {
          return !this.salary.min || value >= this.salary.min;
        },
        message: 'Maximum salary must be greater than or equal to minimum salary'
      }
    },
    currency: {
      type: String,
      default: 'USD',
      enum: ['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD']
    }
  },
  skills: [{
    type: String,
    trim: true,
    maxlength: [50, 'Each skill cannot exceed 50 characters']
  }],
  benefits: [{
    type: String,
    trim: true,
    maxlength: [100, 'Each benefit cannot exceed 100 characters']
  }],
  applicationDeadline: {
    type: Date,
    validate: {
      validator: function(value) {
        return !value || value > new Date();
      },
      message: 'Application deadline must be in the future'
    }
  },
  status: {
    type: String,
    enum: ['active', 'paused', 'closed', 'draft'],
    default: 'active'
  },
  applicationCount: {
    type: Number,
    default: 0,
    min: 0
  },
  viewCount: {
    type: Number,
    default: 0,
    min: 0
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Job must be posted by a user']
  },
  featured: {
    type: Boolean,
    default: false
  },
  remote: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for better query performance
jobSchema.index({ title: 'text', description: 'text', company: 'text' });
jobSchema.index({ location: 1 });
jobSchema.index({ jobType: 1 });
jobSchema.index({ experienceLevel: 1 });
jobSchema.index({ status: 1 });
jobSchema.index({ postedBy: 1 });
jobSchema.index({ createdAt: -1 });
jobSchema.index({ featured: -1, createdAt: -1 });

// Virtual for formatted salary range
jobSchema.virtual('salaryRange').get(function() {
  if (!this.salary.min && !this.salary.max) return null;
  
  const formatSalary = (amount) => {
    if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `${(amount / 1000).toFixed(0)}K`;
    return amount.toString();
  };

  if (this.salary.min && this.salary.max) {
    return `${formatSalary(this.salary.min)} - ${formatSalary(this.salary.max)} ${this.salary.currency}`;
  } else if (this.salary.min) {
    return `${formatSalary(this.salary.min)}+ ${this.salary.currency}`;
  } else {
    return `Up to ${formatSalary(this.salary.max)} ${this.salary.currency}`;
  }
});

// Virtual for time since posted
jobSchema.virtual('timeAgo').get(function() {
  const now = new Date();
  const diffTime = Math.abs(now - this.createdAt);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) return '1 day ago';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return `${Math.floor(diffDays / 30)} months ago`;
});

// Pre-save middleware to update the updatedAt field
jobSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Pre-save middleware to validate salary range
jobSchema.pre('save', function(next) {
  if (this.salary && this.salary.min && this.salary.max) {
    if (this.salary.max < this.salary.min) {
      next(new Error('Maximum salary must be greater than or equal to minimum salary'));
    }
  }
  next();
});

// Static method to find active jobs
jobSchema.statics.findActive = function() {
  return this.find({ status: 'active' });
};

// Static method to find jobs by recruiter
jobSchema.statics.findByRecruiter = function(recruiterId) {
  return this.find({ postedBy: recruiterId });
};

// Instance method to increment view count
jobSchema.methods.incrementViews = function() {
  this.viewCount += 1;
  return this.save();
};

// Instance method to increment application count
jobSchema.methods.incrementApplications = function() {
  this.applicationCount += 1;
  return this.save();
};

// Ensure virtual fields are serialized
jobSchema.set('toJSON', { virtuals: true });
jobSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Job', jobSchema);
