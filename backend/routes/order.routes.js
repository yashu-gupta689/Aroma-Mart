import express from 'express';
import Order from '../models/Order.model.js';
import Cart from '../models/Cart.model.js';
import Product from '../models/Product.model.js';
import User from '../models/User.model.js';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// Razorpay - only initialize when keys are present (optional for dev without payment)
function getRazorpay() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const secret = process.env.RAZORPAY_SECRET || process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !secret) return null;
  return new Razorpay({ key_id: keyId, key_secret: secret });
}

// All routes require authentication
router.use(authenticate);

// @route   POST /api/orders
// @desc    Create new order
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { shippingAddress, paymentMethod = 'razorpay' } = req.body;

    // Get user's cart
    const cart = await Cart.findOne({ user: req.user._id })
      .populate('items.product');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Validate stock and prepare order items
    const orderItems = [];
    let subtotal = 0;

    for (const item of cart.items) {
      const product = item.product;
      
      if (!product || !product.isActive || !product.isApproved) {
        continue; // Skip unavailable products
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          message: `Insufficient stock for ${product.name}` 
        });
      }

      const price = product.discountedPrice || product.price;
      const itemTotal = price * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        product: product._id,
        name: product.name,
        brand: product.brand,
        image: product.images[0],
        price: price,
        quantity: item.quantity,
        size: item.size
      });

      // Update stock
      product.stock -= item.quantity;
      await product.save();
    }

    if (orderItems.length === 0) {
      return res.status(400).json({ message: 'No valid items in cart' });
    }

    const shipping = subtotal > 500 ? 0 : 50; // Free shipping above 500
    const tax = subtotal * 0.18; // 18% GST
    const discount = cart.discount || 0;
    const totalAmount = subtotal + shipping + tax - discount;

    // Create order
    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      subtotal,
      shipping,
      tax,
      discount,
      totalAmount,
      couponCode: cart.couponCode,
      status: 'pending'
    });

    // Calculate commission for marketplace
    const commissionPercentage = process.env.COMMISSION_PERCENTAGE || 15;
    const commissionAmount = (subtotal * commissionPercentage) / 100;

    // For now, assume single seller per order (can be enhanced for multi-seller)
    if (orderItems.length > 0) {
      const firstProduct = await Product.findById(orderItems[0].product);
      if (firstProduct && firstProduct.seller) {
        order.commission = {
          amount: commissionAmount,
          percentage: commissionPercentage
        };
        order.sellerPayout = {
          sellerId: firstProduct.seller,
          amount: subtotal - commissionAmount,
          status: 'pending'
        };
        await order.save();
      }
    }

    // Create Razorpay order if payment method is razorpay
    let razorpayOrder = null;
    const razorpay = getRazorpay();
    if (paymentMethod === 'razorpay' && razorpay) {
      try {
        razorpayOrder = await razorpay.orders.create({
          amount: Math.round(totalAmount * 100), // Convert to paise
          currency: 'INR',
          receipt: order.orderNumber,
          notes: {
            orderId: order._id.toString(),
            userId: req.user._id.toString()
          }
        });

        order.razorpayOrderId = razorpayOrder.id;
        await order.save();
      } catch (error) {
        console.error('Razorpay order creation error:', error);
        // Continue with order creation even if Razorpay fails
      }
    }

    // Clear cart
    cart.items = [];
    cart.couponCode = undefined;
    cart.discount = 0;
    await cart.save();

    res.status(201).json({
      message: 'Order created successfully',
      order,
      razorpayOrder
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Server error creating order' });
  }
});

// @route   POST /api/orders/:orderId/verify-payment
// @desc    Verify Razorpay payment
// @access  Private
router.post('/:orderId/verify-payment', async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_signature } = req.body;
    const order = await Order.findById(req.params.orderId);

    if (!order || order.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Verify signature
    const text = order.razorpayOrderId + '|' + razorpay_payment_id;
    const signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_SECRET || process.env.RAZORPAY_KEY_SECRET)
      .update(text)
      .digest('hex');

    if (signature !== razorpay_signature) {
      order.paymentStatus = 'failed';
      await order.save();
      return res.status(400).json({ message: 'Payment verification failed' });
    }

    // Update order
    order.paymentStatus = 'paid';
    order.paymentId = razorpay_payment_id;
    order.razorpayPaymentId = razorpay_payment_id;
    order.razorpaySignature = razorpay_signature;
    order.status = 'confirmed';
    await order.save();

    // Update seller stats
    if (order.sellerPayout && order.sellerPayout.sellerId) {
      const seller = await User.findById(order.sellerPayout.sellerId);
      if (seller && seller.sellerInfo) {
        seller.sellerInfo.totalSales += 1;
        seller.sellerInfo.totalRevenue += order.sellerPayout.amount;
        await seller.save();
      }
    }

    res.json({
      message: 'Payment verified successfully',
      order
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({ message: 'Server error verifying payment' });
  }
});

// @route   GET /api/orders
// @desc    Get user's orders
// @access  Private
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product', 'name brand images slug')
      .sort('-createdAt');

    res.json(orders);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/orders/:orderId
// @desc    Get single order
// @access  Private
router.get('/:orderId', async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate('items.product', 'name brand images slug')
      .populate('user', 'name email');

    if (!order || order.user._id.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/orders/:orderId/cancel
// @desc    Cancel order
// @access  Private
router.put('/:orderId/cancel', async (req, res) => {
  try {
    const { reason } = req.body;
    const order = await Order.findById(req.params.orderId);

    if (!order || order.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (!['pending', 'confirmed', 'processing'].includes(order.status)) {
      return res.status(400).json({ message: 'Order cannot be cancelled' });
    }

    // Restore stock
    for (const item of order.items) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock += item.quantity;
        await product.save();
      }
    }

    order.status = 'cancelled';
    order.cancelledAt = new Date();
    order.cancellationReason = reason;
    if (order.paymentStatus === 'paid') {
      order.paymentStatus = 'refunded';
    }
    await order.save();

    res.json({ message: 'Order cancelled successfully', order });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
