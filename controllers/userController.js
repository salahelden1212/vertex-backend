import AdminUser from '../models/AdminUser.js';

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await AdminUser.find()
      .select('-password')
      .populate('createdBy', 'name email')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch users'
    });
  }
};

// Get single user
export const getUser = async (req, res) => {
  try {
    const user = await AdminUser.findById(req.params.id)
      .select('-password')
      .populate('createdBy', 'name email');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch user'
    });
  }
};

// Create user
export const createUser = async (req, res) => {
  try {
    const { name, email, password, role, permissions } = req.body;

    // Check if email already exists
    const existingUser = await AdminUser.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already exists'
      });
    }

    // Only super-admin can create super-admin
    if (role === 'super-admin' && req.user.role !== 'super-admin') {
      return res.status(403).json({
        success: false,
        message: 'Only super-admin can create another super-admin'
      });
    }

    const user = await AdminUser.create({
      name,
      email,
      password,
      role: role || 'admin',
      permissions: permissions || {},
      createdBy: req.user._id
    });

    const userResponse = await AdminUser.findById(user._id).select('-password');

    res.status(201).json({
      success: true,
      data: userResponse
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to create user'
    });
  }
};

// Update user
export const updateUser = async (req, res) => {
  try {
    const { name, email, role, permissions, isActive } = req.body;

    const user = await AdminUser.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent user from modifying their own role
    if (req.user._id.toString() === user._id.toString() && role) {
      return res.status(403).json({
        success: false,
        message: 'You cannot modify your own role'
      });
    }

    // Only super-admin can modify super-admin
    if (user.role === 'super-admin' && req.user.role !== 'super-admin') {
      return res.status(403).json({
        success: false,
        message: 'Only super-admin can modify another super-admin'
      });
    }

    // Only super-admin can promote someone to super-admin
    if (role === 'super-admin' && req.user.role !== 'super-admin') {
      return res.status(403).json({
        success: false,
        message: 'Only super-admin can promote to super-admin role'
      });
    }

    // Update fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;
    if (permissions) user.permissions = { ...user.permissions, ...permissions };
    if (typeof isActive !== 'undefined') user.isActive = isActive;

    await user.save();

    const updatedUser = await AdminUser.findById(user._id).select('-password');

    res.status(200).json({
      success: true,
      data: updatedUser
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update user'
    });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const user = await AdminUser.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent user from deleting themselves
    if (req.user._id.toString() === user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You cannot delete your own account'
      });
    }

    // Only super-admin can delete super-admin
    if (user.role === 'super-admin' && req.user.role !== 'super-admin') {
      return res.status(403).json({
        success: false,
        message: 'Only super-admin can delete another super-admin'
      });
    }

    await AdminUser.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete user'
    });
  }
};

// Toggle user active status
export const toggleUserStatus = async (req, res) => {
  try {
    const user = await AdminUser.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent user from deactivating themselves
    if (req.user._id.toString() === user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You cannot deactivate your own account'
      });
    }

    user.isActive = !user.isActive;
    await user.save();

    const updatedUser = await AdminUser.findById(user._id).select('-password');

    res.status(200).json({
      success: true,
      data: updatedUser
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to toggle user status'
    });
  }
};

// Change user password
export const changePassword = async (req, res) => {
  try {
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    const user = await AdminUser.findById(req.params.id).select('+password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to change password'
    });
  }
};
