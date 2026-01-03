import mongoose from 'mongoose';

const packageSchema = new mongoose.Schema({
  name: {
    ar: {
      type: String,
      required: [true, 'Arabic package name is required'],
      trim: true
    },
    en: {
      type: String,
      required: [true, 'English package name is required'],
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
  priceBefore: {
    type: Number,
    required: [true, 'Original price is required'],
    min: 0
  },
  priceAfter: {
    type: Number,
    required: [true, 'Discounted price is required'],
    min: 0
  },
  features: [{
    ar: {
      type: String,
      required: true
    },
    en: {
      type: String,
      required: true
    }
  }],
  badge: {
    type: String,
    enum: ['', 'popular', 'vip', 'new'],
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  },
  pdfUrl: {
    type: String,
    trim: true
  },
  image: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Sort by order by default
packageSchema.index({ order: 1, createdAt: -1 });

export default mongoose.model('Package', packageSchema);
