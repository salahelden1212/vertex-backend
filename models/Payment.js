import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: [true, 'Property reference is required']
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: [true, 'Client reference is required']
  },
  amount: {
    type: Number,
    required: [true, 'Payment amount is required'],
    min: 0
  },
  paymentDate: {
    type: Date,
    required: [true, 'Payment date is required'],
    default: Date.now
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'bank-transfer', 'check', 'credit-card', 'other'],
    default: 'cash'
  },
  transactionId: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    trim: true
  },
  receiptNumber: {
    type: String,
    trim: true,
    unique: true,
    sparse: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'completed'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AdminUser'
  }
}, {
  timestamps: true
});

// Index for reporting and filtering
paymentSchema.index({ property: 1, paymentDate: -1 });
paymentSchema.index({ client: 1, paymentDate: -1 });
paymentSchema.index({ paymentDate: -1 });

// Auto-generate receipt number
paymentSchema.pre('save', async function(next) {
  if (!this.receiptNumber) {
    const count = await mongoose.model('Payment').countDocuments();
    const year = new Date().getFullYear();
    this.receiptNumber = `VF-${year}-${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

export default mongoose.model('Payment', paymentSchema);
