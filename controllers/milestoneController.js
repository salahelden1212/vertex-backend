import Milestone from '../models/Milestone.js';
import Property from '../models/Property.js';

// @desc    Get all milestones
// @route   GET /api/milestones
// @access  Private
export const getMilestones = async (req, res) => {
  try {
    const { property, isCompleted, category, startDate, endDate } = req.query;
    
    let query = {};
    
    if (property) query.property = property;
    if (typeof isCompleted !== 'undefined') query.isCompleted = isCompleted === 'true';
    if (category) query.category = category;
    
    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    
    const milestones = await Milestone.find(query)
      .populate('property', 'address client')
      .populate('createdBy', 'name')
      .sort('date');
    
    res.status(200).json({
      success: true,
      count: milestones.length,
      data: milestones
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch milestones'
    });
  }
};

// @desc    Get single milestone
// @route   GET /api/milestones/:id
// @access  Private
export const getMilestone = async (req, res) => {
  try {
    const milestone = await Milestone.findById(req.params.id)
      .populate('property', 'address client')
      .populate('createdBy', 'name');
    
    if (!milestone) {
      return res.status(404).json({
        success: false,
        message: 'Milestone not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: milestone
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch milestone'
    });
  }
};

// @desc    Create milestone
// @route   POST /api/milestones
// @access  Private
export const createMilestone = async (req, res) => {
  try {
    // Check if property exists
    const property = await Property.findById(req.body.property);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }
    
    const milestone = await Milestone.create({
      ...req.body,
      createdBy: req.user._id
    });
    
    const populatedMilestone = await Milestone.findById(milestone._id)
      .populate('property', 'address client');
    
    res.status(201).json({
      success: true,
      data: populatedMilestone
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to create milestone'
    });
  }
};

// @desc    Update milestone
// @route   PUT /api/milestones/:id
// @access  Private
export const updateMilestone = async (req, res) => {
  try {
    let milestone = await Milestone.findById(req.params.id);
    
    if (!milestone) {
      return res.status(404).json({
        success: false,
        message: 'Milestone not found'
      });
    }
    
    milestone = await Milestone.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('property', 'address client');
    
    res.status(200).json({
      success: true,
      data: milestone
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update milestone'
    });
  }
};

// @desc    Delete milestone
// @route   DELETE /api/milestones/:id
// @access  Private
export const deleteMilestone = async (req, res) => {
  try {
    const milestone = await Milestone.findById(req.params.id);
    
    if (!milestone) {
      return res.status(404).json({
        success: false,
        message: 'Milestone not found'
      });
    }
    
    await milestone.deleteOne();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete milestone'
    });
  }
};

// @desc    Toggle milestone completion
// @route   PUT /api/milestones/:id/toggle
// @access  Private
export const toggleMilestone = async (req, res) => {
  try {
    const milestone = await Milestone.findById(req.params.id);
    
    if (!milestone) {
      return res.status(404).json({
        success: false,
        message: 'Milestone not found'
      });
    }
    
    milestone.isCompleted = !milestone.isCompleted;
    milestone.completedDate = milestone.isCompleted ? new Date() : null;
    
    await milestone.save();
    
    const populatedMilestone = await Milestone.findById(milestone._id)
      .populate('property', 'address client');
    
    res.status(200).json({
      success: true,
      data: populatedMilestone
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to toggle milestone'
    });
  }
};
