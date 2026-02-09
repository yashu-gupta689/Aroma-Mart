import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  size: {
    type: String,
    default: '100ml'
  }
});

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [cartItemSchema],
  couponCode: String,
  discount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Calculate cart total
cartSchema.methods.calculateTotal = async function() {
  let subtotal = 0;
  
  for (const item of this.items) {
    const product = await mongoose.model('Product').findById(item.product);
    if (product && product.isActive && product.isApproved) {
      const price = product.discountedPrice || product.price;
      subtotal += price * item.quantity;
    }
  }
  
  const total = subtotal - this.discount;
  return {
    subtotal,
    discount: this.discount,
    total: Math.max(0, total)
  };
};

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;
