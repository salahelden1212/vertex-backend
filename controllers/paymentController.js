import Payment from '../models/Payment.js';
import Property from '../models/Property.js';
import asyncHandler from '../utils/asyncHandler.js';

// @desc    Get all payments
// @route   GET /api/payments
// @access  Private/Admin
export const getPayments = asyncHandler(async (req, res) => {
  const { propertyId, clientId, startDate, endDate, status } = req.query;
  
  let filter = {};
  
  if (propertyId) filter.property = propertyId;
  if (clientId) filter.client = clientId;
  if (status) filter.status = status;
  
  if (startDate || endDate) {
    filter.paymentDate = {};
    if (startDate) filter.paymentDate.$gte = new Date(startDate);
    if (endDate) filter.paymentDate.$lte = new Date(endDate);
  }

  const payments = await Payment.find(filter)
    .populate('property', 'address propertyType')
    .populate('client', 'name phone')
    .populate('createdBy', 'name')
    .sort({ paymentDate: -1 });

  // Calculate totals
  const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);

  res.status(200).json({
    success: true,
    count: payments.length,
    totalAmount,
    data: payments
  });
});

// @desc    Get single payment
// @route   GET /api/payments/:id
// @access  Private/Admin
export const getPayment = asyncHandler(async (req, res) => {
  const payment = await Payment.findById(req.params.id)
    .populate('property', 'address propertyType totalPrice')
    .populate('client', 'name phone email')
    .populate('createdBy', 'name email');

  if (!payment) {
    return res.status(404).json({
      success: false,
      message: 'Payment not found'
    });
  }

  res.status(200).json({
    success: true,
    data: payment
  });
});

// @desc    Create payment
// @route   POST /api/payments
// @access  Private/Admin
export const createPayment = asyncHandler(async (req, res) => {
  // Verify property exists
  const property = await Property.findById(req.body.property);
  
  if (!property) {
    return res.status(404).json({
      success: false,
      message: 'Property not found'
    });
  }

  // Set client from property
  req.body.client = property.client;
  req.body.createdBy = req.user._id;

  const payment = await Payment.create(req.body);

  res.status(201).json({
    success: true,
    data: payment
  });
});

// @desc    Update payment
// @route   PUT /api/payments/:id
// @access  Private/Admin
export const updatePayment = asyncHandler(async (req, res) => {
  let payment = await Payment.findById(req.params.id);

  if (!payment) {
    return res.status(404).json({
      success: false,
      message: 'Payment not found'
    });
  }

  payment = await Payment.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  }).populate('property', 'address')
    .populate('client', 'name');

  res.status(200).json({
    success: true,
    data: payment
  });
});

// @desc    Delete payment
// @route   DELETE /api/payments/:id
// @access  Private/Admin
export const deletePayment = asyncHandler(async (req, res) => {
  const payment = await Payment.findById(req.params.id);

  if (!payment) {
    return res.status(404).json({
      success: false,
      message: 'Payment not found'
    });
  }

  await payment.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get payment statistics
// @route   GET /api/payments/stats
// @access  Private/Admin
export const getPaymentStats = asyncHandler(async (req, res) => {
  const { year, month } = req.query;
  
  let dateFilter = {};
  
  if (year) {
    const startDate = new Date(year, month ? month - 1 : 0, 1);
    const endDate = month 
      ? new Date(year, month, 0, 23, 59, 59)
      : new Date(year, 11, 31, 23, 59, 59);
    
    dateFilter.paymentDate = { $gte: startDate, $lte: endDate };
  }

  const stats = await Payment.aggregate([
    { $match: { ...dateFilter, status: 'completed' } },
    {
      $group: {
        _id: null,
        totalAmount: { $sum: '$amount' },
        count: { $sum: 1 },
        avgAmount: { $avg: '$amount' }
      }
    }
  ]);

  res.status(200).json({
    success: true,
    data: stats[0] || { totalAmount: 0, count: 0, avgAmount: 0 }
  });
});
