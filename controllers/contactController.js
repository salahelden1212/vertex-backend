import ContactMessage from '../models/ContactMessage.js';
import asyncHandler from '../utils/asyncHandler.js';

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
export const submitContactForm = asyncHandler(async (req, res) => {
  const message = await ContactMessage.create(req.body);

  res.status(201).json({
    success: true,
    message: 'Your message has been sent successfully',
    data: message
  });
});

// @desc    Get all contact messages
// @route   GET /api/contact
// @access  Private/Admin
export const getContactMessages = asyncHandler(async (req, res) => {
  const { status } = req.query;
  
  let filter = {};
  if (status) filter.status = status;

  const messages = await ContactMessage.find(filter).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: messages.length,
    data: messages
  });
});

// @desc    Get single contact message
// @route   GET /api/contact/:id
// @access  Private/Admin
export const getContactMessage = asyncHandler(async (req, res) => {
  const message = await ContactMessage.findById(req.params.id);

  if (!message) {
    return res.status(404).json({
      success: false,
      message: 'Message not found'
    });
  }

  // Mark as read if it's new
  if (message.status === 'new') {
    message.status = 'read';
    await message.save();
  }

  res.status(200).json({
    success: true,
    data: message
  });
});

// @desc    Update message status
// @route   PUT /api/contact/:id
// @access  Private/Admin
export const updateMessageStatus = asyncHandler(async (req, res) => {
  const message = await ContactMessage.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status, notes: req.body.notes },
    { new: true, runValidators: true }
  );

  if (!message) {
    return res.status(404).json({
      success: false,
      message: 'Message not found'
    });
  }

  res.status(200).json({
    success: true,
    data: message
  });
});

// @desc    Delete contact message
// @route   DELETE /api/contact/:id
// @access  Private/Admin
export const deleteContactMessage = asyncHandler(async (req, res) => {
  const message = await ContactMessage.findById(req.params.id);

  if (!message) {
    return res.status(404).json({
      success: false,
      message: 'Message not found'
    });
  }

  await message.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});
