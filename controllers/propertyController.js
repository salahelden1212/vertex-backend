import Property from '../models/Property.js';
import Payment from '../models/Payment.js';
import asyncHandler from '../utils/asyncHandler.js';

// @desc    Get all properties
// @route   GET /api/properties
// @access  Private/Admin
export const getProperties = asyncHandler(async (req, res) => {
  const { status, clientId } = req.query;
  
  let filter = {};
  
  if (status) filter.status = status;
  if (clientId) filter.client = clientId;

  const properties = await Property.find(filter)
    .populate('client', 'name phone email')
    .populate('selectedPackage', 'name')
    .sort({ createdAt: -1 });

  // Calculate total paid for each property
  const propertiesWithPayments = await Promise.all(
    properties.map(async (property) => {
      const payments = await Payment.find({ property: property._id, status: 'completed' });
      const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0);
      
      return {
        ...property.toObject(),
        totalPaid,
        remainingAmount: property.totalPrice - totalPaid
      };
    })
  );

  res.status(200).json({
    success: true,
    count: propertiesWithPayments.length,
    data: propertiesWithPayments
  });
});

// @desc    Get single property
// @route   GET /api/properties/:id
// @access  Private/Admin
export const getProperty = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id)
    .populate('client', 'name phone email address')
    .populate('selectedPackage', 'name priceBefore priceAfter');

  if (!property) {
    return res.status(404).json({
      success: false,
      message: 'Property not found'
    });
  }

  // Get all payments for this property
  const payments = await Payment.find({ property: property._id }).sort({ paymentDate: -1 });
  const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0);

  res.status(200).json({
    success: true,
    data: {
      property,
      payments,
      totalPaid,
      remainingAmount: property.totalPrice - totalPaid
    }
  });
});

// @desc    Create property
// @route   POST /api/properties
// @access  Private/Admin
export const createProperty = asyncHandler(async (req, res) => {
  const property = await Property.create(req.body);

  res.status(201).json({
    success: true,
    data: property
  });
});

// @desc    Update property
// @route   PUT /api/properties/:id
// @access  Private/Admin
export const updateProperty = asyncHandler(async (req, res) => {
  let property = await Property.findById(req.params.id);

  if (!property) {
    return res.status(404).json({
      success: false,
      message: 'Property not found'
    });
  }

  property = await Property.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  }).populate('client', 'name phone email')
    .populate('selectedPackage', 'name');

  res.status(200).json({
    success: true,
    data: property
  });
});

// @desc    Delete property
// @route   DELETE /api/properties/:id
// @access  Private/Admin
export const deleteProperty = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);

  if (!property) {
    return res.status(404).json({
      success: false,
      message: 'Property not found'
    });
  }

  // Delete all associated payments
  await Payment.deleteMany({ property: property._id });

  await property.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});
