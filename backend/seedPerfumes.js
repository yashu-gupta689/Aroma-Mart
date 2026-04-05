import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Product from './models/Product.model.js';
import User from './models/User.model.js';

dotenv.config();

const MONGO_URI =
  process.env.MONGO_URI ||
  process.env.MONGODB_URI ||
  'mongodb://localhost:27017/aromamart_db';

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

async function ensureSeller() {
  const email = 'seed.seller@example.com';
  let seller = await User.findOne({ email });
  if (!seller) {
    seller = await User.create({
      name: 'Demo Seller',
      email,
      password: 'password123',
      role: 'seller',
      sellerInfo: { isApproved: true, isVerified: true, brandName: 'Demo Brands' },
    });
  }
  return seller;
}

function data(sellerId) {
  const P = (brand, name, price, desc, img, category = 'men', stock = 25, notes) => ({
    brand,
    name,
    description: desc,
    category,
    price,
    stock,
    images: [img],
    fragranceNotes: notes || {
      top: 'Citrus, Aromatic',
      middle: 'Spices, Floral nuances',
      base: 'Woody notes, Musk',
    },
    seller: sellerId,
    featured: false,
    bestseller: false,
    isApproved: true,
    isActive: true,
    slug: slugify(`${brand}-${name}`),
    tags: ['Perfume'],
  });

  const items = [
    P(
      'Wild Stone',
      'Code Titanium',
      899,
      'A bold masculine fragrance with woody and spicy notes for long-lasting freshness.',
      'https://images.unsplash.com/photo-1594035910387-fea47794261f',
      'men',
      25,
      { top: 'Bergamot, Lemon', middle: 'Spices, Lavender', base: 'Cedarwood, Amber, Musk' }
    ),
    P(
      'Fogg',
      'Impressio Eau De Parfum',
      599,
      'A refreshing daily wear perfume with a clean citrus opening and soft floral heart.',
      'https://images.unsplash.com/photo-1615634260167-c8cdede054de',
      'men',
      30,
      { top: 'Orange, Lemon', middle: 'Jasmine, Rose', base: 'Musk, Sandalwood' }
    ),
    P(
      'Bella Vita',
      'Luxury Gold Oud',
      999,
      'Rich oud accord balanced with warm amber and soft woods, crafted for special occasions.',
      'https://images.unsplash.com/photo-1585386959984-a4155224a1ad',
      'unisex',
      20,
      { top: 'Saffron, Cardamom', middle: 'Oud, Rose', base: 'Amber, Vanilla, Woods' }
    ),
    P(
      'Engage',
      "L'amante Perfume",
      499,
      'A romantic fragrance with fruity-floral notes and a gentle woody drydown.',
      'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519',
      'women',
      35,
      { top: 'Pear, Red fruits', middle: 'Rose, Jasmine', base: 'Cedar, Musk' }
    ),
    P(
      'Denver',
      'Hamilton Eau De Parfum',
      799,
      'A classic masculine scent with lavender and herbs over a deep woody base.',
      'https://images.unsplash.com/photo-1595425970377-c9703cf48b6d',
      'men',
      18,
      { top: 'Lavender, Lemon', middle: 'Aromatic herbs', base: 'Vetiver, Cedar, Oakmoss' }
    ),
    P(
      'Park Avenue',
      'Signature Collection',
      699,
      'Elegant fragrance for confident men with a long-lasting aromatic trail.',
      'https://images.unsplash.com/photo-1615634260167-c8cdede054de',
      'men',
      22,
      { top: 'Citrus, Aldehydes', middle: 'Spices, Floral notes', base: 'Woody notes, Musk' }
    ),
    P(
      'Axe',
      'Signature Dark Temptation',
      449,
      'Sweet and spicy chocolate-inspired notes for a playful, cozy vibe.',
      'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd',
      'men',
      40,
      { top: 'Cocoa, Orange', middle: 'Spices', base: 'Vanilla, Amber, Woods' }
    ),
    P(
      'Skinn by Titan',
      'Raw Perfume',
      1499,
      'Premium fragrance with fresh citrus brightness and woody undertones.',
      'https://images.unsplash.com/photo-1615634260167-c8cdede054de',
      'men',
      15,
      { top: 'Bergamot, Lemon', middle: 'Violet leaf, Floral nuances', base: 'Musk, Woods' }
    ),
    P(
      'Bella Vita',
      'CEO Man',
      899,
      'Clean and confident woody-aromatic with a bright, uplifting opening.',
      'https://images.unsplash.com/photo-1585386959984-a4155224a1ad',
      'men',
      28,
      { top: 'Lemon, Grapefruit', middle: 'Vetiver, Spices', base: 'Cedar, Amber, Musk' }
    ),
    P(
      'Wild Stone',
      'Ultra Sensual',
      799,
      'Long-lasting fragrance with warm spicy-woody character for daily wear.',
      'https://images.unsplash.com/photo-1594035910387-fea47794261f',
      'men',
      26,
      { top: 'Cardamom, Citrus', middle: 'Lavender, Spices', base: 'Amber, Tonka, Woods' }
    ),
    P(
      'Villain',
      'Hydra',
      799,
      'Marine-citrus freshness with a musky woody dry down, ideal for hot days.',
      'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519',
      'men',
      32,
      { top: 'Lime, Bergamot', middle: 'Marine notes, Herbs', base: 'Cedar, Musk' }
    ),
    P(
      'Ustraa',
      'Scuba',
      699,
      'Fresh aquatic profile with citrus and subtle woods for an easygoing style.',
      'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd',
      'men',
      24,
      { top: 'Lemon, Mint', middle: 'Aquatic notes', base: 'Woody notes, Musk' }
    ),
    P(
      'Fogg',
      'Xpressio',
      649,
      'Bright citrus with green nuances and a soft musky base for daily use.',
      'https://images.unsplash.com/photo-1615634260167-c8cdede054de',
      'unisex',
      20,
      { top: 'Lemon, Orange', middle: 'Green notes, Floral hints', base: 'Musk, Light woods' }
    ),
    P(
      'Engage',
      'Yang Women',
      549,
      'A feminine fruity-floral with a gentle creamy base, perfect for day wear.',
      'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519',
      'women',
      27,
      { top: 'Red berries, Pear', middle: 'Rose, Jasmine', base: 'Vanilla, Musk' }
    ),
    P(
      'Park Avenue',
      'Voyage Sport',
      599,
      'Energetic citrus-aromatic blend with clean woods, ideal for outdoors.',
      'https://images.unsplash.com/photo-1595425970377-c9703cf48b6d',
      'men',
      29,
      { top: 'Lime, Orange', middle: 'Herbal notes', base: 'Cedarwood, Musk' }
    ),
    P(
      'Bella Vita',
      'Oud Intense',
      1499,
      'Intense oud with smoky-amber nuances for a premium, long-lasting signature.',
      'https://images.unsplash.com/photo-1585386959984-a4155224a1ad',
      'unisex',
      12,
      { top: 'Saffron, Pepper', middle: 'Oud, Rose', base: 'Amber, Woods, Vanilla' }
    ),
    P(
      'Wild Stone',
      'Forest Spice',
      699,
      'Spicy-green opening over warm woody base, evoking a walk through pines.',
      'https://images.unsplash.com/photo-1594035910387-fea47794261f',
      'men',
      21,
      { top: 'Green notes, Cardamom', middle: 'Cedar, Spices', base: 'Patchouli, Tonka' }
    ),
    P(
      'Fogg',
      'Scent Intensio',
      799,
      'Powerful aromatic with bright spices and a rich amber-woody finish.',
      'https://images.unsplash.com/photo-1615634260167-c8cdede054de',
      'men',
      23,
      { top: 'Pepper, Citrus', middle: 'Lavender, Spices', base: 'Amber, Woods' }
    ),
    P(
      'Engage',
      'Blush',
      499,
      'Soft floral bouquet with fruity sweetness and a gentle creamy base.',
      'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519',
      'women',
      33,
      { top: 'Peach, Apple', middle: 'Peony, Jasmine', base: 'Vanilla, Musk' }
    ),
    P(
      'Skinn by Titan',
      'Nude',
      1799,
      'A modern feminine floral with warm vanilla and soft woody undertones.',
      'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd',
      'women',
      14,
      { top: 'Lychee, Bergamot', middle: 'Rose, Magnolia', base: 'Vanilla, Sandalwood' }
    ),
  ];

  return items;
}

async function main() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGO_URI);
  console.log('Connected');
  try {
    const seller = await ensureSeller();
    // Only perfume products in DB
    await Product.deleteMany({});
    const items = data(seller._id);
    // Compute discountedPrice and slug handled by pre-save hook on create/save; we use insertMany with raw docs.
    // To ensure hooks run, use create in a loop or insertMany with { rawResult: false } and then save. We'll use create for correctness.
    for (const doc of items) {
      await Product.findOneAndUpdate(
        { brand: doc.brand, name: doc.name },
        { $set: doc, $setOnInsert: { rating: { average: 0, count: 0 } } },
        { upsert: true }
      );
    }
    console.log('Perfume products added successfully');
  } catch (err) {
    console.error('Seeding error:', err);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

main();

