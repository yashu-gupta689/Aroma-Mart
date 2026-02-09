import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  title: {
    type: String,
    trim: true
  },
  comment: {
    type: String,
    required: [true, 'Review comment is required'],
    trim: true
  },
  images: [String],
  verifiedPurchase: {
    type: Boolean,
    default: false
  },
  helpful: {
    count: { type: Number, default: 0 },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  },
  isApproved: {
    type: Boolean,
    default: false // Admin can moderate reviews
  }
}, {
  timestamps: true
});

// Update product rating when review is saved
reviewSchema.post('save', async function() {
  const Review = mongoose.model('Review');
  const Product = mongoose.model('Product');
  
  const reviews = await Review.find({ 
    product: this.product, 
    isApproved: true 
  });
  
  if (reviews.length > 0) {
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    await Product.findByIdAndUpdate(this.product, {
      'rating.average': Math.round(avgRating * 10) / 10,
      'rating.count': reviews.length
    });
  }
});

reviewSchema.index({ product: 1, user: 1 }, { unique: true });
reviewSchema.index({ product: 1 });
reviewSchema.index({ user: 1 });

const Review = mongoose.model('Review', reviewSchema);

export default Review;
