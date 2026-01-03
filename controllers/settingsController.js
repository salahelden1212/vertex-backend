import SiteSettings from '../models/SiteSettings.js';
import asyncHandler from '../utils/asyncHandler.js';

// @desc    Get site settings
// @route   GET /api/settings
// @access  Public
export const getSettings = asyncHandler(async (req, res) => {
  const settings = await SiteSettings.getSettings();

  res.status(200).json({
    success: true,
    data: settings
  });
});

// @desc    Update site settings
// @route   PUT /api/settings
// @access  Private/Admin
export const updateSettings = asyncHandler(async (req, res) => {
  let settings = await SiteSettings.findOne();

  if (!settings) {
    settings = await SiteSettings.create(req.body);
  } else {
    settings = await SiteSettings.findByIdAndUpdate(settings._id, req.body, {
      new: true,
      runValidators: true
    });
  }

  res.status(200).json({
    success: true,
    data: settings
  });
});
