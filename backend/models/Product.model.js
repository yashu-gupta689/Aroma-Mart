import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  brand: {
    type: String,
    required: [true, 'Brand name is required'],
    trim: true
  },
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  category: {
    type: String,
    required: true,
    enum: ['men', 'women', 'unisex', 'niche', 'designer']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  discount: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  discountedPrice: {
    type: Number
  },
  stock: {
    type: Number,
    required: true,
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  images: [{
    type: String,
    required: true
  }],
  fragranceNotes: {
    top: {
      type: String,
      required: true
    },
    middle: {
      type: String,
      required: true
    },
    base: {
      type: String,
      required: true
    }
  },
  longevity: {
    type: Number,
    min: 1,
    max: 5,
    default: 3
  },
  projection: {
    type: Number,
    min: 1,
    max: 5,
    default: 3
  },
  size: {
    type: String,
    enum: ['30ml', '50ml', '100ml', '200ml', 'other'],
    default: '100ml'
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  brandLogo: {
    type: String
  },
  rating: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0 }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isApproved: {
    type: Boolean,
    default: false // Admin approval required
  },
  tags: [String],
  featured: {
    type: Boolean,
    default: false
  },
  bestseller: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Calculate discounted price before saving
productSchema.pre('save', function(next) {
  if (this.discount > 0) {
    this.discountedPrice = this.price * (1 - this.discount / 100);
  } else {
    this.discountedPrice = this.price;
  }
  
  // Generate slug if not provided
  if (!this.slug) {
    this.slug = `${this.brand}-${this.name}`.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  
  next();
});

// Indexes for better query performance
productSchema.index({ brand: 1 });
productSchema.index({ category: 1 });
productSchema.index({ seller: 1 });
productSchema.index({ 'rating.average': -1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ name: 'text', brand: 'text', description: 'text' });

const Product = mongoose.model('Product', productSchema);

export default Product;
