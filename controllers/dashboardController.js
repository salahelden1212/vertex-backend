import Client from '../models/Client.js';
import Property from '../models/Property.js';
import Payment from '../models/Payment.js';
import Project from '../models/Project.js';
import ContactMessage from '../models/ContactMessage.js';
import asyncHandler from '../utils/asyncHandler.js';

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private/Admin
export const getDashboardStats = asyncHandler(async (req, res) => {
  // Total counts
  const totalClients = await Client.countDocuments({ status: 'active' });
  const totalProperties = await Property.countDocuments();
  const activeProperties = await Property.countDocuments({ 
    status: { $in: ['pending', 'in-progress'] } 
  });
  const completedProperties = await Property.countDocuments({ status: 'completed' });
  
  // Financial stats
  const allProperties = await Property.find();
  const totalRevenue = allProperties.reduce((sum, prop) => sum + prop.totalPrice, 0);
  
  const allPayments = await Payment.find({ status: 'completed' });
  const totalPaid = allPayments.reduce((sum, payment) => sum + payment.amount, 0);
  
  const totalRemaining = totalRevenue - totalPaid;

  // Recent activities
  const recentPayments = await Payment.find()
    .populate('client', 'name')
    .populate('property', 'address')
    .sort({ createdAt: -1 })
    .limit(5);

  const recentProperties = await Property.find()
    .populate('client', 'name phone')
    .sort({ createdAt: -1 })
    .limit(5);

  const unreadMessages = await ContactMessage.countDocuments({ status: 'new' });

  // Monthly revenue (last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const monthlyRevenue = await Payment.aggregate([
    {
      $match: {
        status: 'completed',
        paymentDate: { $gte: sixMonthsAgo }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$paymentDate' },
          month: { $month: '$paymentDate' }
        },
        total: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    },
    {
      $sort: { '_id.year': 1, '_id.month': 1 }
    }
  ]);

  // Properties by status
  const propertiesByStatus = await Property.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);

  res.status(200).json({
    success: true,
    data: {
      overview: {
        totalClients,
        totalProperties,
        activeProperties,
        completedProperties,
        totalRevenue,
        totalPaid,
        totalRemaining,
        unreadMessages
      },
      recentPayments,
      recentProperties,
      monthlyRevenue,
      propertiesByStatus
    }
  });
});

// @desc    Get financial report
// @route   GET /api/dashboard/financial-report
// @access  Private/Admin
export const getFinancialReport = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;
  
  let dateFilter = {};
  if (startDate || endDate) {
    dateFilter.paymentDate = {};
    if (startDate) dateFilter.paymentDate.$gte = new Date(startDate);
    if (endDate) dateFilter.paymentDate.$lte = new Date(endDate);
  }

  const payments = await Payment.find({ ...dateFilter, status: 'completed' })
    .populate('client', 'name')
    .populate('property', 'address propertyType')
    .sort({ paymentDate: -1 });

  const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0);

  // Group by payment method
  const byPaymentMethod = await Payment.aggregate([
    { $match: { ...dateFilter, status: 'completed' } },
    {
      $group: {
        _id: '$paymentMethod',
        total: { $sum: '$amount' },
        count: { $sum: 1 }
      }
    }
  ]);

  res.status(200).json({
    success: true,
    data: {
      payments,
      totalPaid,
      paymentsCount: payments.length,
      byPaymentMethod
    }
  });
});
