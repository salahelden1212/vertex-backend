import Client from '../models/Client.js';
import Property from '../models/Property.js';
import Payment from '../models/Payment.js';
import asyncHandler from '../utils/asyncHandler.js';

// @desc    Get all clients
// @route   GET /api/clients
// @access  Private/Admin
export const getClients = asyncHandler(async (req, res) => {
  const { status, search } = req.query;
  
  let filter = {};
  
  if (status) filter.status = status;
  
  if (search) {
    filter.$text = { $search: search };
  }

  const clients = await Client.find(filter).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: clients.length,
    data: clients
  });
});

// @desc    Get single client
// @route   GET /api/clients/:id
// @access  Private/Admin
export const getClient = asyncHandler(async (req, res) => {
  const client = await Client.findById(req.params.id);

  if (!client) {
    return res.status(404).json({
      success: false,
      message: 'Client not found'
    });
  }

  // Get client's properties
  const properties = await Property.find({ client: client._id })
    .populate('selectedPackage', 'name');

  // Get total payments
  const payments = await Payment.find({ client: client._id });
  const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0);

  res.status(200).json({
    success: true,
    data: {
      client,
      properties,
      totalPaid,
      paymentsCount: payments.length
    }
  });
});

// @desc    Create client
// @route   POST /api/clients
// @access  Private/Admin
export const createClient = asyncHandler(async (req, res) => {
  const client = await Client.create(req.body);

  res.status(201).json({
    success: true,
    data: client
  });
});

// @desc    Update client
// @route   PUT /api/clients/:id
// @access  Private/Admin
export const updateClient = asyncHandler(async (req, res) => {
  let client = await Client.findById(req.params.id);

  if (!client) {
    return res.status(404).json({
      success: false,
      message: 'Client not found'
    });
  }

  client = await Client.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: client
  });
});

// @desc    Delete client
// @route   DELETE /api/clients/:id
// @access  Private/Admin
export const deleteClient = asyncHandler(async (req, res) => {
  const client = await Client.findById(req.params.id);

  if (!client) {
    return res.status(404).json({
      success: false,
      message: 'Client not found'
    });
  }

  // Check if client has properties
  const propertiesCount = await Property.countDocuments({ client: client._id });
  
  if (propertiesCount > 0) {
    return res.status(400).json({
      success: false,
      message: 'Cannot delete client with existing properties'
    });
  }

  await client.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});
