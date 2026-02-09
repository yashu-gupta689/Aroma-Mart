import express from 'express';
import Product from '../models/Product.model.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// @route   GET /api/products
// @desc    Get all products with filters
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      category,
      brand,
      minPrice,
      maxPrice,
      minRating,
      bestseller,
      featured,
      search,
      sort = '-createdAt',
      page = 1,
      limit = 12
    } = req.query;

    const query = { isActive: true, isApproved: true };

    // Filters
    if (category) query.category = category;
    if (brand) query.brand = new RegExp(brand, 'i');
    if (minPrice || maxPrice) {
      query.$or = [
        { discountedPrice: { $gte: Number(minPrice) || 0, $lte: Number(maxPrice) || Infinity } },
        { price: { $gte: Number(minPrice) || 0, $lte: Number(maxPrice) || Infinity } }
      ];
    }
    if (minRating) query['rating.average'] = { $gte: Number(minRating) };
    if (bestseller === 'true') query.bestseller = true;
    if (featured === 'true') query.featured = true;

    // Search
    if (search) {
      query.$text = { $search: search };
    }

    const skip = (page - 1) * limit;

    const products = await Product.find(query)
      .populate('seller', 'name sellerInfo.brandName sellerInfo.brandLogo')
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

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

// @route   GET /api/products/:id
// @desc    Get single product
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('seller', 'name sellerInfo.brandName sellerInfo.brandLogo sellerInfo.isVerified');

    if (!product || !product.isActive) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Get similar products
    const similarProducts = await Product.find({
      $or: [
        { brand: product.brand },
        { category: product.category }
      ],
      _id: { $ne: product._id },
      isActive: true,
      isApproved: true
    })
    .limit(4)
    .select('name brand images price discountedPrice rating slug');

    res.json({
      product,
      similarProducts
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/products/brand/:brandName
// @desc    Get products by brand
// @access  Public
router.get('/brand/:brandName', async (req, res) => {
  try {
    const products = await Product.find({
      brand: new RegExp(req.params.brandName, 'i'),
      isActive: true,
      isApproved: true
    }).sort('-createdAt');

    res.json(products);
  } catch (error) {
    console.error('Get brand products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/products/category/:category
// @desc    Get products by category
// @access  Public
router.get('/category/:category', async (req, res) => {
  try {
    const products = await Product.find({
      category: req.params.category,
      isActive: true,
      isApproved: true
    }).sort('-createdAt');

    res.json(products);
  } catch (error) {
    console.error('Get category products error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
