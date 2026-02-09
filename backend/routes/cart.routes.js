import express from 'express';
import Cart from '../models/Cart.model.js';
import Product from '../models/Product.model.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// @route   GET /api/cart
// @desc    Get user's cart
// @access  Private
router.get('/', async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id })
      .populate('items.product', 'name brand images price discountedPrice stock isActive isApproved');

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    // Filter out inactive or unapproved products
    cart.items = cart.items.filter(item => 
      item.product && item.product.isActive && item.product.isApproved
    );

    const totals = await cart.calculateTotal();

    res.json({
      cart,
      totals
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/cart
// @desc    Add item to cart
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { productId, quantity = 1, size = '100ml' } = req.body;

    const product = await Product.findById(productId);
    if (!product || !product.isActive || !product.isApproved) {
      return res.status(404).json({ message: 'Product not found or unavailable' });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    // Check if item already exists
    const existingItemIndex = cart.items.findIndex(
      item => item.product.toString() === productId && item.size === size
    );

    if (existingItemIndex > -1) {
      const newQuantity = cart.items[existingItemIndex].quantity + quantity;
      if (newQuantity > product.stock) {
        return res.status(400).json({ message: 'Insufficient stock' });
      }
      cart.items[existingItemIndex].quantity = newQuantity;
    } else {
      cart.items.push({ product: productId, quantity, size });
    }

    await cart.save();

    const totals = await cart.calculateTotal();

    res.json({
      message: 'Item added to cart',
      cart,
      totals
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/cart/:itemId
// @desc    Update cart item quantity
// @access  Private
router.put('/:itemId', async (req, res) => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const item = cart.items.id(req.params.itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    const product = await Product.findById(item.product);
    if (quantity > product.stock) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    item.quantity = quantity;
    await cart.save();

    const totals = await cart.calculateTotal();

    res.json({
      message: 'Cart updated',
      cart,
      totals
    });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/cart/:itemId
// @desc    Remove item from cart
// @access  Private
router.delete('/:itemId', async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter(item => item._id.toString() !== req.params.itemId);
    await cart.save();

    const totals = await cart.calculateTotal();

    res.json({
      message: 'Item removed from cart',
      cart,
      totals
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/cart
// @desc    Clear entire cart
// @access  Private
router.delete('/', async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = [];
    cart.couponCode = undefined;
    cart.discount = 0;
    await cart.save();

    res.json({ message: 'Cart cleared' });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
