import express from 'express';
import User from '../models/User.model.js';
import Product from '../models/Product.model.js';
import Order from '../models/Order.model.js';
import { authenticate, isAdmin } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes require admin authentication
router.use(authenticate);
router.use(isAdmin);

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Private (Admin)
router.get('/users', async (req, res) => {
  try {
    const { role, page = 1, limit = 20 } = req.query;
    const query = role ? { role } : {};

    const users = await User.find(query)
      .select('-password')
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.json({
      users,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/admin/users/:userId/approve-seller
// @desc    Approve seller
// @access  Private (Admin)
router.put('/users/:userId/approve-seller', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user || user.role !== 'seller') {
      return res.status(404).json({ message: 'Seller not found' });
    }

    user.sellerInfo.isApproved = true;
    user.sellerInfo.isVerified = true;
    await user.save();

    res.json({ message: 'Seller approved successfully', user });
  } catch (error) {
    console.error('Approve seller error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/admin/users/:userId/ban
// @desc    Ban/unban user
// @access  Private (Admin)
router.put('/users/:userId/ban', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.json({ 
      message: `User ${user.isActive ? 'unbanned' : 'banned'} successfully`, 
      user 
    });
  } catch (error) {
    console.error('Ban user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/products
// @desc    Get all products (including unapproved)
// @access  Private (Admin)
router.get('/products', async (req, res) => {
  try {
    const { approved, page = 1, limit = 20 } = req.query;
    const query = {};

    if (approved === 'false') {
      query.isApproved = false;
    }

    const products = await Product.find(query)
      .populate('seller', 'name email sellerInfo.brandName')
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Product.countDocuments(query);

    res.json({
      products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/admin/products/:productId/approve
// @desc    Approve product
// @access  Private (Admin)
router.put('/products/:productId/approve', async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.isApproved = true;
    await product.save();

    res.json({ message: 'Product approved successfully', product });
  } catch (error) {
    console.error('Approve product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/admin/products/:productId/reject
// @desc    Reject product
// @access  Private (Admin)
router.put('/products/:productId/reject', async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.isApproved = false;
    product.isActive = false;
    await product.save();

    res.json({ message: 'Product rejected successfully', product });
  } catch (error) {
    console.error('Reject product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/orders
// @desc    Get all orders
// @access  Private (Admin)
router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('items.product', 'name brand')
      .sort('-createdAt');

    res.json(orders);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/admin/orders/:orderId/status
// @desc    Update order status
// @access  Private (Admin)
router.put('/orders/:orderId/status', async (req, res) => {
  try {
    const { status, trackingNumber } = req.body;
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (status === 'delivered') order.deliveredAt = new Date();

    await order.save();

    res.json({ message: 'Order status updated successfully', order });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/analytics
// @desc    Get platform analytics
// @access  Private (Admin)
router.get('/analytics', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalSellers = await User.countDocuments({ role: 'seller' });
    const totalProducts = await Product.countDocuments({ isActive: true, isApproved: true });
    const totalOrders = await Order.countDocuments({ status: { $ne: 'cancelled' } });

    const orders = await Order.find({ status: { $ne: 'cancelled' } });
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const totalCommission = orders.reduce((sum, order) => sum + (order.commission?.amount || 0), 0);

    // Monthly revenue
    const monthlyRevenue = {};
    orders.forEach(order => {
      const month = new Date(order.createdAt).toLocaleString('default', { month: 'long', year: 'numeric' });
      monthlyRevenue[month] = (monthlyRevenue[month] || 0) + order.totalAmount;
    });

    // Best-selling products (platform-wide)
    const productSales = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        const id = item.product?.toString?.() || item.product;
        if (!id) return;
        const key = id.toString();
        if (!productSales[key]) productSales[key] = { productId: id, quantity: 0, name: item.name, brand: item.brand };
        productSales[key].quantity += item.quantity || 0;
      });
    });
    const bestSellingProducts = Object.values(productSales)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10);

    res.json({
      stats: {
        totalUsers,
        totalSellers,
        totalProducts,
        totalOrders,
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        totalCommission: Math.round(totalCommission * 100) / 100,
        monthlyRevenue,
        bestSellingProducts
      }
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/admin/commission
// @desc    Update commission percentage
// @access  Private (Admin)
router.put('/commission', async (req, res) => {
  try {
    const { percentage } = req.body;
    
    if (percentage < 0 || percentage > 100) {
      return res.status(400).json({ message: 'Commission must be between 0 and 100' });
    }

    // Update environment variable (in production, use database config)
    process.env.COMMISSION_PERCENTAGE = percentage.toString();

    res.json({ 
      message: 'Commission percentage updated successfully',
      commissionPercentage: percentage 
    });
  } catch (error) {
    console.error('Update commission error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
