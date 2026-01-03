import Package from '../models/Package.js';
import asyncHandler from '../utils/asyncHandler.js';

// @desc    Get all packages
// @route   GET /api/packages
// @access  Public
export const getPackages = asyncHandler(async (req, res) => {
  const { isActive } = req.query;
  
  let filter = {};
  if (isActive !== undefined) {
    filter.isActive = isActive === 'true';
  }

  const packages = await Package.find(filter).sort({ order: 1, createdAt: -1 });

  res.status(200).json({
    success: true,
    count: packages.length,
    data: packages
  });
});

// @desc    Get single package
// @route   GET /api/packages/:id
// @access  Public
export const getPackage = asyncHandler(async (req, res) => {
  const package_ = await Package.findById(req.params.id);

  if (!package_) {
    return res.status(404).json({
      success: false,
      message: 'Package not found'
    });
  }

  res.status(200).json({
    success: true,
    data: package_
  });
});

// @desc    Create package
// @route   POST /api/packages
// @access  Private/Admin
export const createPackage = asyncHandler(async (req, res) => {
  const package_ = await Package.create(req.body);

  res.status(201).json({
    success: true,
    data: package_
  });
});

// @desc    Update package
// @route   PUT /api/packages/:id
// @access  Private/Admin
export const updatePackage = asyncHandler(async (req, res) => {
  let package_ = await Package.findById(req.params.id);

  if (!package_) {
    return res.status(404).json({
      success: false,
      message: 'Package not found'
    });
  }

  package_ = await Package.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: package_
  });
});

// @desc    Delete package
// @route   DELETE /api/packages/:id
// @access  Private/Admin
export const deletePackage = asyncHandler(async (req, res) => {
  const package_ = await Package.findById(req.params.id);

  if (!package_) {
    return res.status(404).json({
      success: false,
      message: 'Package not found'
    });
  }

  await package_.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Reorder packages
// @route   PUT /api/packages/reorder
// @access  Private/Admin
export const reorderPackages = asyncHandler(async (req, res) => {
  const { packageOrders } = req.body; // Array of { id, order }

  const updatePromises = packageOrders.map(({ id, order }) =>
    Package.findByIdAndUpdate(id, { order })
  );

  await Promise.all(updatePromises);

  res.status(200).json({
    success: true,
    message: 'Packages reordered successfully'
  });
});
