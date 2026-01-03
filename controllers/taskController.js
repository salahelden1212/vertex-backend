import Task from '../models/Task.js';
import Property from '../models/Property.js';

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
export const getTasks = async (req, res) => {
  try {
    const { property, status, assignedTo, startDate, endDate } = req.query;
    
    let query = {};
    
    if (property) query.property = property;
    if (status) query.status = status;
    if (assignedTo) query.assignedTo = assignedTo;
    
    if (startDate && endDate) {
      query.$or = [
        { startDate: { $gte: new Date(startDate), $lte: new Date(endDate) } },
        { endDate: { $gte: new Date(startDate), $lte: new Date(endDate) } }
      ];
    }
    
    const tasks = await Task.find(query)
      .populate('property', 'address client')
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name')
      .sort('startDate');
    
    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch tasks'
    });
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
export const getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('property', 'address client')
      .populate('assignedTo', 'name email')
      .populate('dependencies')
      .populate('createdBy', 'name');
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch task'
    });
  }
};

// @desc    Create task
// @route   POST /api/tasks
// @access  Private
export const createTask = async (req, res) => {
  try {
    // Check if property exists
    const property = await Property.findById(req.body.property);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }
    
    const task = await Task.create({
      ...req.body,
      createdBy: req.user._id
    });
    
    const populatedTask = await Task.findById(task._id)
      .populate('property', 'address client')
      .populate('assignedTo', 'name email');
    
    res.status(201).json({
      success: true,
      data: populatedTask
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to create task'
    });
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
export const updateTask = async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }
    
    task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('property', 'address client')
      .populate('assignedTo', 'name email');
    
    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update task'
    });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }
    
    await task.deleteOne();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete task'
    });
  }
};

// @desc    Update task progress
// @route   PUT /api/tasks/:id/progress
// @access  Private
export const updateTaskProgress = async (req, res) => {
  try {
    const { progress } = req.body;
    
    if (progress < 0 || progress > 100) {
      return res.status(400).json({
        success: false,
        message: 'Progress must be between 0 and 100'
      });
    }
    
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { 
        progress,
        status: progress === 100 ? 'completed' : progress > 0 ? 'in-progress' : 'pending'
      },
      { new: true }
    )
      .populate('property', 'address client')
      .populate('assignedTo', 'name email');
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update progress'
    });
  }
};
