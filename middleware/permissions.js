import AdminUser from '../models/AdminUser.js';

// Check if user has specific permission
export const checkPermission = (permission) => {
  return async (req, res, next) => {
    try {
      const user = await AdminUser.findById(req.user._id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Super admin has all permissions
      if (user.role === 'super-admin') {
        return next();
      }

      // Check specific permission
      const [module, action] = permission.split('.');
      
      if (action === 'manage' && module === 'users') {
        return res.status(403).json({
          success: false,
          message: 'Access denied. Only super-admin can manage users.'
        });
      }

      if (!user.permissions[module]) {
        return res.status(403).json({
          success: false,
          message: `Access denied. You don't have permission to access ${module}.`
        });
      }

      next();
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Permission check failed'
      });
    }
  };
};

// Check if user has specific role
export const checkRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role: ${roles.join(' or ')}`
      });
    }
    next();
  };
};

// Check if user can perform write operations
export const canWrite = (req, res, next) => {
  if (req.user.role === 'viewer') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Viewers can only read data.'
    });
  }
  next();
};
