import mongoose from 'mongoose';

const milestoneSchema = new mongoose.Schema({
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: [true, 'Property reference is required']
  },
  title: {
    type: String,
    required: [true, 'Milestone title is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  date: {
    type: Date,
    required: [true, 'Milestone date is required']
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  completedDate: {
    type: Date
  },
  notes: {
    type: String
  },
  category: {
    type: String,
    enum: ['planning', 'construction', 'inspection', 'payment', 'delivery', 'other'],
    default: 'other'
  },
  notifyBefore: {
    type: Number,
    default: 7 // days before
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AdminUser'
  }
}, {
  timestamps: true
});

// Set completedDate when isCompleted changes to true
milestoneSchema.pre('save', function(next) {
  if (this.isCompleted && !this.completedDate) {
    this.completedDate = new Date();
  }
  next();
});

export default mongoose.model('Milestone', milestoneSchema);
