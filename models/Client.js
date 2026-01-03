import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Client name is required'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  address: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'completed'],
    default: 'active'
  },
  source: {
    type: String,
    enum: ['website', 'whatsapp', 'referral', 'direct', 'other'],
    default: 'website'
  }
}, {
  timestamps: true
});

// Index for searching
clientSchema.index({ name: 'text', phone: 'text', email: 'text' });

export default mongoose.model('Client', clientSchema);
