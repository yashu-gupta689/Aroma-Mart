import express from 'express';
import Product from '../models/Product.model.js';
import Order from '../models/Order.model.js';
import User from '../models/User.model.js';
import { authenticate, isSeller } from '../middleware/auth.middleware.js';
import { upload } from '../utils/uploadImage.js';
import { uploadToCloudinary } from '../utils/uploadImage.js';

const router = express.Router();

// All routes require seller authentication
router.use(authenticate);
router.use(isSeller);

// @route   GET /api/seller/products
// @desc    Get seller's products
// @access  Private (Seller)
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user._id })
      .sort('-createdAt');

    res.json(products);
  } catch (error) {
    console.error('Get seller products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/seller/products
// @desc    Create new product
// @access  Private (Seller)
router.post('/products', upload.array('images', 5), async (req, res) => {
  try {
    const {
      brand,
      name,
      description,
      category,
      price,
      discount,
      stock,
      fragranceNotes,
      longevity,
      projection,
      size
    } = req.body;

    // Parse fragrance notes
    let notes = {};
    if (typeof fragranceNotes === 'string') {
      notes = JSON.parse(fragranceNotes);
    } else {
      notes = fragranceNotes;
    }

    // Upload images to Cloudinary
    const imageUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const url = await uploadToCloudinary(file.buffer, 'aromamart/products');
        imageUrls.push(url);
      }
    }

    // Get seller's brand info
    const seller = await User.findById(req.user._id);
    const brandLogo = seller.sellerInfo?.brandLogo || '';

    const product = await Product.create({
      brand,
      name,
      description,
      category,
      price: Number(price),
      discount: Number(discount) || 0,
      stock: Number(stock),
      images: imageUrls,
      fragranceNotes: notes,
      longevity: Number(longevity) || 3,
      projection: Number(projection) || 3,
      size: size || '100ml',
      seller: req.user._id,
      brandLogo,
      isApproved: false // Requires admin approval
    });

    res.status(201).json({
      message: 'Product created successfully. Waiting for admin approval.',
      product
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Server error creating product' });
  }
});

// @route   PUT /api/seller/products/:productId
// @desc    Update product
// @access  Private (Seller)
router.put('/products/:productId', upload.array('images', 5), async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);

    if (!product || product.seller.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const updateData = { ...req.body };

    // Handle image uploads
    if (req.files && req.files.length > 0) {
      const imageUrls = [];
      for (const file of req.files) {
        const url = await uploadToCloudinary(file.buffer, 'aromamart/products');
        imageUrls.push(url);
      }
      updateData.images = imageUrls;
    }

    // Parse fragrance notes if provided
    if (updateData.fragranceNotes && typeof updateData.fragranceNotes === 'string') {
      updateData.fragranceNotes = JSON.parse(updateData.fragranceNotes);
    }

    // Convert string numbers to numbers
    if (updateData.price) updateData.price = Number(updateData.price);
    if (updateData.discount) updateData.discount = Number(updateData.discount);
    if (updateData.stock) updateData.stock = Number(updateData.stock);

    Object.assign(product, updateData);
    product.isApproved = false; // Re-approval needed after update
    await product.save();

    res.json({ message: 'Product updated successfully', product });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/seller/products/:productId
// @desc    Delete product
// @access  Private (Seller)
router.delete('/products/:productId', async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);

    if (!product || product.seller.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.isActive = false;
    await product.save();

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/seller/orders
// @desc    Get seller's orders
// @access  Private (Seller)
router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find({
      'sellerPayout.sellerId': req.user._id
    })
    .populate('user', 'name email')
    .populate('items.product', 'name brand images')
    .sort('-createdAt');

    res.json(orders);
  } catch (error) {
    console.error('Get seller orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/seller/orders/:orderId/status
// @desc    Mark order as shipped or delivered (seller only for their orders)
// @access  Private (Seller)
router.put('/orders/:orderId/status', async (req, res) => {
  try {
    const { status, trackingNumber } = req.body;
    const order = await Order.findById(req.params.orderId);

    if (!order || order.sellerPayout?.sellerId?.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (!['shipped', 'delivered'].includes(status)) {
      return res.status(400).json({ message: 'Status must be shipped or delivered' });
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

// @route   GET /api/seller/analytics
// @desc    Get seller analytics
// @access  Private (Seller)
router.get('/analytics', async (req, res) => {
  try {
    const seller = await User.findById(req.user._id);
    
    const totalProducts = await Product.countDocuments({ seller: req.user._id });
    const activeProducts = await Product.countDocuments({ 
      seller: req.user._id, 
      isActive: true,
      isApproved: true 
    });

    const orders = await Order.find({
      'sellerPayout.sellerId': req.user._id,
      status: { $ne: 'cancelled' }
    });

    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => 
      sum + (order.sellerPayout?.amount || 0), 0
    );
    const totalCommission = orders.reduce((sum, order) => 
      sum + (order.commission?.amount || 0), 0
    );

    // Monthly sales
    const monthlySales = {};
    orders.forEach(order => {
      const month = new Date(order.createdAt).toLocaleString('default', { month: 'long', year: 'numeric' });
      monthlySales[month] = (monthlySales[month] || 0) + 1;
    });

    // Best-selling products
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
      sellerInfo: seller.sellerInfo,
      stats: {
        totalProducts,
        activeProducts,
        totalOrders,
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        totalCommission: Math.round(totalCommission * 100) / 100,
        monthlySales,
        bestSellingProducts
      }
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/seller/profile
// @desc    Update seller profile
// @access  Private (Seller)
router.put('/profile', upload.single('brandLogo'), async (req, res) => {
  try {
    const { brandName, description } = req.body;
    const seller = await User.findById(req.user._id);

    if (brandName) seller.sellerInfo.brandName = brandName;
    if (description) seller.sellerInfo.description = description;

    if (req.file) {
      const logoUrl = await uploadToCloudinary(req.file.buffer, 'aromamart/brands');
      seller.sellerInfo.brandLogo = logoUrl;
    }

    await seller.save();

    res.json({ message: 'Seller profile updated successfully', seller });
  } catch (error) {
    console.error('Update seller profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
