import express from 'express';
import Wishlist from '../models/Wishlist.model.js';
import Product from '../models/Product.model.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// Require auth for all wishlist routes
router.use(authenticate);

// GET /api/wishlist
router.get('/', async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id })
      .populate('products', 'name brand images price discountedPrice stock isActive isApproved');
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, products: [] });
    }
    // Filter out inactive/unapproved products
    wishlist.products = wishlist.products.filter(p => p?.isActive && p?.isApproved);
    res.json({ products: wishlist.products });
  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/wishlist  { productId }
router.post('/', async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await Product.findById(productId);
    if (!product || !product.isActive || !product.isApproved) {
      return res.status(404).json({ message: 'Product not found or unavailable' });
    }
    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, products: [] });
    }
    const exists = wishlist.products.some(p => p.toString() === productId);
    if (!exists) {
      wishlist.products.push(productId);
      await wishlist.save();
    }
    res.json({ message: 'Added to wishlist', productId });
  } catch (error) {
    console.error('Add wishlist error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/wishlist/:productId
router.delete('/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      return res.status(404).json({ message: 'Wishlist not found' });
    }
    wishlist.products = wishlist.products.filter(p => p.toString() !== productId);
    await wishlist.save();
    res.json({ message: 'Removed from wishlist', productId });
  } catch (error) {
    console.error('Remove wishlist error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

