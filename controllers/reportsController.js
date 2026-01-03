import Payment from '../models/Payment.js';
import Property from '../models/Property.js';
import Client from '../models/Client.js';
import { startOfMonth, endOfMonth, subMonths, format } from 'date-fns';

// Get payments report
export const getPaymentsReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const start = startDate ? new Date(startDate) : startOfMonth(new Date());
    const end = endDate ? new Date(endDate) : endOfMonth(new Date());

    // Get all payments in period
    const payments = await Payment.find({
      paymentDate: { $gte: start, $lte: end }
    }).populate('property', 'address')
      .populate('client', 'name');

    // Calculate totals
    const totalPayments = payments.length;
    const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);

    // Group by payment method
    const paymentsByMethod = payments.reduce((acc, payment) => {
      const method = payment.paymentMethod;
      if (!acc[method]) {
        acc[method] = { count: 0, amount: 0 };
      }
      acc[method].count++;
      acc[method].amount += payment.amount;
      return acc;
    }, {});

    // Group by status
    const paymentsByStatus = payments.reduce((acc, payment) => {
      const status = payment.status;
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    // Monthly breakdown
    const monthlyBreakdown = [];
    for (let i = 0; i < 6; i++) {
      const monthStart = startOfMonth(subMonths(new Date(), i));
      const monthEnd = endOfMonth(subMonths(new Date(), i));
      
      const monthPayments = payments.filter(p => 
        p.paymentDate >= monthStart && p.paymentDate <= monthEnd
      );
      
      monthlyBreakdown.unshift({
        month: format(monthStart, 'MMM yyyy'),
        count: monthPayments.length,
        amount: monthPayments.reduce((sum, p) => sum + p.amount, 0)
      });
    }

    res.status(200).json({
      success: true,
      data: {
        period: { start, end },
        totalPayments,
        totalAmount,
        paymentsByMethod,
        paymentsByStatus,
        monthlyBreakdown,
        payments: payments.slice(0, 50) // Latest 50
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate payments report'
    });
  }
};

// Get overdue report
export const getOverdueReport = async (req, res) => {
  try {
    const today = new Date();

    // Get properties with remaining balance
    const properties = await Property.find({
      status: { $in: ['in-progress', 'pending'] }
    }).populate('client', 'name phone email');

    // Get payments for each property
    const overdueData = [];
    
    for (const property of properties) {
      const payments = await Payment.find({ property: property._id });
      const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
      const remaining = property.totalPrice - totalPaid;

      if (remaining > 0 && property.expectedCompletionDate && property.expectedCompletionDate < today) {
        const daysOverdue = Math.floor((today - property.expectedCompletionDate) / (1000 * 60 * 60 * 24));
        
        overdueData.push({
          property: {
            _id: property._id,
            address: property.address,
            propertyType: property.propertyType
          },
          client: property.client,
          totalPrice: property.totalPrice,
          paid: totalPaid,
          remaining: remaining,
          dueDate: property.expectedCompletionDate,
          daysOverdue: daysOverdue
        });
      }
    }

    // Sort by days overdue (descending)
    overdueData.sort((a, b) => b.daysOverdue - a.daysOverdue);

    const totalOverdue = overdueData.reduce((sum, item) => sum + item.remaining, 0);

    res.status(200).json({
      success: true,
      data: {
        totalOverdue,
        count: overdueData.length,
        properties: overdueData
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate overdue report'
    });
  }
};

// Get profit report
export const getProfitReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const start = startDate ? new Date(startDate) : startOfMonth(subMonths(new Date(), 5));
    const end = endDate ? new Date(endDate) : endOfMonth(new Date());

    // Get all payments (revenue)
    const payments = await Payment.find({
      paymentDate: { $gte: start, $lte: end },
      status: 'completed'
    });

    const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);

    // Monthly breakdown
    const monthlyData = [];
    for (let i = 0; i < 6; i++) {
      const monthStart = startOfMonth(subMonths(new Date(), i));
      const monthEnd = endOfMonth(subMonths(new Date(), i));
      
      const monthPayments = payments.filter(p => 
        p.paymentDate >= monthStart && p.paymentDate <= monthEnd
      );
      
      const revenue = monthPayments.reduce((sum, p) => sum + p.amount, 0);
      
      // Estimated cost (70% of revenue)
      const cost = revenue * 0.7;
      const profit = revenue - cost;
      
      monthlyData.unshift({
        month: format(monthStart, 'MMM yyyy'),
        revenue,
        cost,
        profit,
        profitMargin: revenue > 0 ? ((profit / revenue) * 100).toFixed(1) : 0
      });
    }

    const totalCost = totalRevenue * 0.7; // Estimated
    const grossProfit = totalRevenue - totalCost;
    const profitMargin = totalRevenue > 0 ? ((grossProfit / totalRevenue) * 100).toFixed(1) : 0;

    res.status(200).json({
      success: true,
      data: {
        period: { start, end },
        totalRevenue,
        totalCost,
        grossProfit,
        profitMargin,
        monthlyData
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate profit report'
    });
  }
};

// Get top clients report
export const getClientsReport = async (req, res) => {
  try {
    const clients = await Client.find();
    
    const clientsData = [];
    
    for (const client of clients) {
      const properties = await Property.find({ client: client._id });
      const totalValue = properties.reduce((sum, p) => sum + p.totalPrice, 0);
      
      let totalPaid = 0;
      for (const property of properties) {
        const payments = await Payment.find({ property: property._id });
        totalPaid += payments.reduce((sum, p) => sum + p.amount, 0);
      }
      
      if (totalValue > 0) {
        clientsData.push({
          client: {
            _id: client._id,
            name: client.name,
            phone: client.phone,
            email: client.email
          },
          propertiesCount: properties.length,
          totalValue,
          totalPaid,
          remaining: totalValue - totalPaid
        });
      }
    }

    // Sort by total value (descending)
    clientsData.sort((a, b) => b.totalValue - a.totalValue);

    res.status(200).json({
      success: true,
      data: {
        count: clientsData.length,
        clients: clientsData.slice(0, 20) // Top 20
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate clients report'
    });
  }
};
