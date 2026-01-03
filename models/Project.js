import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: {
    ar: {
      type: String,
      required: [true, 'Arabic title is required'],
      trim: true
    },
    en: {
      type: String,
      required: [true, 'English title is required'],
      trim: true
    }
  },
  description: {
    ar: {
      type: String,
      trim: true
    },
    en: {
      type: String,
      trim: true
    }
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['residential', 'commercial', 'administrative'],
    default: 'residential'
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    caption: {
      ar: String,
      en: String
    }
  }],
  coverImage: {
    type: String,
    required: [true, 'Cover image is required']
  },
  location: {
    type: String,
    trim: true
  },
  area: {
    type: Number,
    min: 0
  },
  completionDate: {
    type: Date
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client'
  }
}, {
  timestamps: true
});

// Index for filtering and sorting
projectSchema.index({ category: 1, isFeatured: -1, order: 1, createdAt: -1 });
projectSchema.index({ title: 'text', description: 'text' });

export default mongoose.model('Project', projectSchema);
