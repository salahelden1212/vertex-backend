import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: [true, 'Client reference is required']
  },
  propertyType: {
    type: String,
    required: [true, 'Property type is required'],
    enum: ['apartment', 'villa', 'office', 'showroom', 'commercial', 'other'],
    default: 'apartment'
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true
  },
  area: {
    type: Number,
    required: [true, 'Area is required'],
    min: 0
  },
  selectedPackage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Package'
  },
  customPackageName: {
    type: String,
    trim: true
  },
  totalPrice: {
    type: Number,
    required: [true, 'Total price is required'],
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed', 'on-hold', 'cancelled'],
    default: 'pending'
  },
  startDate: {
    type: Date
  },
  expectedEndDate: {
    type: Date
  },
  actualEndDate: {
    type: Date
  },
  notes: {
    type: String,
    trim: true
  },
  images: [{
    type: String
  }],
  documents: [{
    name: String,
    url: String
  }]
}, {
  timestamps: true
});

// Virtual for total paid
propertySchema.virtual('totalPaid', {
  ref: 'Payment',
  localField: '_id',
  foreignField: 'property',
  justOne: false
});

// Calculate remaining amount
propertySchema.virtual('remainingAmount').get(function() {
  return this.totalPrice - (this.totalPaidAmount || 0);
});

// Index for searching
propertySchema.index({ client: 1, status: 1, createdAt: -1 });

export default mongoose.model('Property', propertySchema);
