import Project from '../models/Project.js';
import asyncHandler from '../utils/asyncHandler.js';

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
export const getProjects = asyncHandler(async (req, res) => {
  const { category, isFeatured, isActive } = req.query;
  
  let filter = {};
  
  if (category) filter.category = category;
  if (isFeatured !== undefined) filter.isFeatured = isFeatured === 'true';
  if (isActive !== undefined) filter.isActive = isActive === 'true';

  const projects = await Project.find(filter)
    .sort({ isFeatured: -1, order: 1, createdAt: -1 })
    .populate('client', 'name');

  res.status(200).json({
    success: true,
    count: projects.length,
    data: projects
  });
});

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Public
export const getProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id).populate('client', 'name phone email');

  if (!project) {
    return res.status(404).json({
      success: false,
      message: 'Project not found'
    });
  }

  res.status(200).json({
    success: true,
    data: project
  });
});

// @desc    Create project
// @route   POST /api/projects
// @access  Private/Admin
export const createProject = asyncHandler(async (req, res) => {
  const project = await Project.create(req.body);

  res.status(201).json({
    success: true,
    data: project
  });
});

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private/Admin
export const updateProject = asyncHandler(async (req, res) => {
  let project = await Project.findById(req.params.id);

  if (!project) {
    return res.status(404).json({
      success: false,
      message: 'Project not found'
    });
  }

  project = await Project.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: project
  });
});

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private/Admin
export const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    return res.status(404).json({
      success: false,
      message: 'Project not found'
    });
  }

  await project.deleteOne();

  res.status(200).json({
    success: true,
    data: {}
  });
});

// @desc    Get projects by category
// @route   GET /api/projects/category/:category
// @access  Public
export const getProjectsByCategory = asyncHandler(async (req, res) => {
  const projects = await Project.find({
    category: req.params.category,
    isActive: true
  }).sort({ isFeatured: -1, order: 1, createdAt: -1 });

  res.status(200).json({
    success: true,
    count: projects.length,
    data: projects
  });
});
