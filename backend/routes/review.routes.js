import express from 'express';
import Review from '../models/Review.model.js';
import Order from '../models/Order.model.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

// @route   GET /api/reviews/product/:productId
// @desc    Get reviews for a product
// @access  Public
router.get('/product/:productId', async (req, res) => {
  try {
    const reviews = await Review.find({ 
      product: req.params.productId,
      isApproved: true 
    })
    .populate('user', 'name avatar')
    .sort('-createdAt');

    res.json(reviews);
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/reviews
// @desc    Create review
// @access  Private
router.post('/', authenticate, async (req, res) => {
  try {
    const { productId, orderId, rating, title, comment, images } = req.body;

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({
      user: req.user._id,
      product: productId
    });

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this product' });
    }

    // Verify purchase if orderId provided
    let verifiedPurchase = false;
    if (orderId) {
      const order = await Order.findOne({
        _id: orderId,
        user: req.user._id,
        'items.product': productId,
        status: 'delivered'
      });

      if (order) {
        verifiedPurchase = true;
      }
    }

    const review = await Review.create({
      user: req.user._id,
      product: productId,
      order: orderId,
      rating,
      title,
      comment,
      images: images || [],
      verifiedPurchase
    });

    res.status(201).json({
      message: 'Review submitted successfully',
      review
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/reviews/:reviewId/helpful
// @desc    Mark review as helpful
// @access  Private
router.put('/:reviewId/helpful', authenticate, async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    const userId = req.user._id.toString();
    const helpfulIndex = review.helpful.users.indexOf(userId);

    if (helpfulIndex > -1) {
      // Remove helpful vote
      review.helpful.users.splice(helpfulIndex, 1);
      review.helpful.count -= 1;
    } else {
      // Add helpful vote
      review.helpful.users.push(userId);
      review.helpful.count += 1;
    }

    await review.save();

    res.json({ 
      message: 'Review updated',
      helpful: review.helpful 
    });
  } catch (error) {
    console.error('Update helpful error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
