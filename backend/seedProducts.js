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
      password: 'password123', // hashed by pre-save hook
      role: 'seller',
      sellerInfo: { isApproved: true, isVerified: true, brandName: 'Demo Brands' },
    });
  }
  return seller;
}

function productsData(sellerId) {
  const img = (q) => [
    `https://source.unsplash.com/800x800/?perfume,${encodeURIComponent(q)}`,
  ];

  const items = [
    {
      brand: 'Dior',
      name: 'Sauvage Eau de Toilette',
      description:
        'Fresh, spicy and powerful fragrance with bergamot and ambroxan. Versatile signature for day and night.',
      category: 'designer',
      price: 4999,
      discount: 20,
      stock: 40,
      images: img('dior sauvage'),
      fragranceNotes: {
        top: 'Calabrian bergamot, Pepper',
        middle: 'Lavender, Sichuan pepper, Pink pepper',
        base: 'Ambroxan, Cedar, Labdanum',
      },
      size: '100ml',
      featured: true,
      bestseller: true,
    },
    {
      brand: 'Chanel',
      name: 'Bleu de Chanel',
      description:
        'A refined woody aromatic with citrus brightness and a smooth incense-cedar base. Modern and timeless.',
      category: 'designer',
      price: 7200,
      discount: 10,
      stock: 35,
      images: img('bleu de chanel'),
      fragranceNotes: {
        top: 'Grapefruit, Lemon, Mint',
        middle: 'Ginger, Nutmeg, Jasmine',
        base: 'Incense, Vetiver, Cedar, Sandalwood',
      },
      size: '100ml',
      featured: true,
    },
    {
      brand: 'Giorgio Armani',
      name: 'Acqua di Giò',
      description:
        'Iconic aquatic citrus opening with a clean, mineral heart and musky woods in the base. Perfect for warm weather.',
      category: 'designer',
      price: 5200,
      discount: 15,
      stock: 60,
      images: img('acqua di gio'),
      fragranceNotes: {
        top: 'Jasmine, Lime, Bergamot',
        middle: 'Marine notes, Peach, Rose, Calone',
        base: 'Cedar, Oakmoss, White musk, Patchouli',
      },
      size: '100ml',
      bestseller: true,
    },
    {
      brand: 'Versace',
      name: 'Eros',
      description:
        'Vibrant mint and green apple over a warm tonka-vanilla base. Youthful and attention-grabbing.',
      category: 'men',
      price: 4800,
      discount: 18,
      stock: 50,
      images: img('versace eros'),
      fragranceNotes: {
        top: 'Mint, Green apple, Lemon',
        middle: 'Tonka bean, Ambroxan, Geranium',
        base: 'Vanilla, Cedar, Vetiver',
      },
      size: '100ml',
    },
    {
      brand: 'Paco Rabanne',
      name: '1 Million',
      description:
        'Spicy-citrus opening with cinnamon and leather over sweet amber. Loud and charismatic party scent.',
      category: 'men',
      price: 4300,
      discount: 25,
      stock: 45,
      images: img('paco rabanne 1 million'),
      fragranceNotes: {
        top: 'Grapefruit, Mint, Blood mandarin',
        middle: 'Cinnamon, Rose, Spicy notes',
        base: 'Leather, Amber, Patchouli',
      },
      size: '100ml',
    },
    {
      brand: 'Calvin Klein',
      name: 'CK One',
      description:
        'Clean, fresh unisex citrus with subtle green tea and musk. Casual everyday wear.',
      category: 'unisex',
      price: 2800,
      discount: 12,
      stock: 80,
      images: img('ck one'),
      fragranceNotes: {
        top: 'Lemon, Bergamot, Pineapple',
        middle: 'Green tea, Violet, Nutmeg',
        base: 'Musk, Amber, Cedar',
      },
      size: '100ml',
    },
    {
      brand: 'Davidoff',
      name: 'Cool Water',
      description:
        'Classic aquatic with crisp mint and lavender, evoking a fresh ocean breeze.',
      category: 'men',
      price: 2600,
      discount: 10,
      stock: 70,
      images: img('davidoff cool water'),
      fragranceNotes: {
        top: 'Mint, Lavender, Coriander',
        middle: 'Geranium, Jasmine, Neroli',
        base: 'Musk, Amber, Oakmoss',
      },
      size: '100ml',
    },
    {
      brand: 'Armaf',
      name: 'Club de Nuit Intense Man',
      description:
        'Smoky citrus opening that dries to a mossy, musky wood. Compliment magnet at a great value.',
      category: 'men',
      price: 2200,
      discount: 5,
      stock: 90,
      images: img('armaf club de nuit intense man'),
      fragranceNotes: {
        top: 'Lemon, Pineapple, Blackcurrant',
        middle: 'Birch, Jasmine, Rose',
        base: 'Musk, Ambergris, Patchouli, Vanilla',
      },
      size: '105ml',
      bestseller: true,
    },
    {
      brand: 'Ajmal',
      name: 'Amber Wood',
      description:
        'Warm amber with rich woods and a slightly resinous sweetness. Sophisticated and long-lasting.',
      category: 'niche',
      price: 3500,
      discount: 8,
      stock: 30,
      images: img('ajmal amber wood'),
      fragranceNotes: {
        top: 'Cardamom, Apple, Lavender',
        middle: 'Cedarwood, Orris, Amber',
        base: 'Patchouli, Vetiver, Woody notes',
      },
      size: '100ml',
      featured: true,
    },
    {
      brand: 'Nishane',
      name: 'Hacivat',
      description:
        'Refined pineapple-bergamot over earthy oakmoss. Elegant chypre with excellent performance.',
      category: 'niche',
      price: 14500,
      discount: 5,
      stock: 20,
      images: img('nishane hacivat'),
      fragranceNotes: {
        top: 'Pineapple, Grapefruit, Bergamot',
        middle: 'Cedar, Patchouli, Jasmine',
        base: 'Oakmoss, Woody notes',
      },
      size: '100ml',
    },
    {
      brand: 'Yves Saint Laurent',
      name: 'Libre',
      description:
        'Modern white floral built around lavender and orange blossom, with a warm vanilla base.',
      category: 'women',
      price: 6800,
      discount: 12,
      stock: 55,
      images: img('ysl libre'),
      fragranceNotes: {
        top: 'Lavender, Mandarin, Blackcurrant',
        middle: 'Orange blossom, Jasmine',
        base: 'Vanilla, Cedar, Ambergris',
      },
      size: '90ml',
    },
    {
      brand: 'Carolina Herrera',
      name: 'Good Girl',
      description:
        'Glamorous mix of tuberose and jasmine with tonka and cocoa. Bold and feminine.',
      category: 'women',
      price: 7600,
      discount: 10,
      stock: 35,
      images: img('good girl perfume'),
      fragranceNotes: {
        top: 'Almond, Coffee, Bergamot',
        middle: 'Tuberose, Jasmine Sambac',
        base: 'Tonka bean, Cocoa, Vanilla',
      },
      size: '80ml',
    },
    {
      brand: 'Tom Ford',
      name: 'Oud Wood',
      description:
        'Smooth, luxurious oud with cardamom and creamy woods. Understated and elegant.',
      category: 'niche',
      price: 17500,
      discount: 7,
      stock: 15,
      images: img('tom ford oud wood'),
      fragranceNotes: {
        top: 'Cardamom, Rosewood',
        middle: 'Oud, Sandalwood, Vetiver',
        base: 'Tonka bean, Amber',
      },
      size: '100ml',
    },
    {
      brand: 'Wild Stone',
      name: 'Code Titanium',
      description:
        'Daily-wear masculine fragrance with fresh citrus and spicy-woody heart. Great value for college and office.',
      category: 'men',
      price: 699,
      discount: 0,
      stock: 100,
      images: img('wild stone perfume'),
      fragranceNotes: {
        top: 'Citrus, Aldehydes',
        middle: 'Spices, Floral notes',
        base: 'Cedarwood, Amber, Musk',
      },
      size: '100ml',
    },
    {
      brand: 'Park Avenue',
      name: 'Trance',
      description:
        'Fresh aromatic profile with a subtle woody base, ideal for casual day use.',
      category: 'men',
      price: 599,
      discount: 0,
      stock: 85,
      images: img('park avenue perfume'),
      fragranceNotes: {
        top: 'Citrus, Green notes',
        middle: 'Aromatic herbs',
        base: 'Woody notes, Musk',
      },
      size: '100ml',
    },
    {
      brand: 'Bella Vita',
      name: 'CEO Man',
      description:
        'Clean and confident woody-aromatic with bright citrus opening and warm base.',
      category: 'men',
      price: 899,
      discount: 0,
      stock: 90,
      images: img('bella vita perfume'),
      fragranceNotes: {
        top: 'Lemon, Grapefruit',
        middle: 'Vetiver, Spices',
        base: 'Cedar, Amber, Musk',
      },
      size: '100ml',
    },
    {
      brand: 'Ustraa',
      name: 'Scuba',
      description:
        'Fresh aquatic profile with citrus and subtle woods. Easygoing and refreshing.',
      category: 'men',
      price: 699,
      discount: 0,
      stock: 75,
      images: img('ustraa scuba'),
      fragranceNotes: {
        top: 'Lemon, Mint',
        middle: 'Aquatic notes',
        base: 'Woody notes, Musk',
      },
      size: '100ml',
    },
    {
      brand: 'Villain',
      name: 'Hydra',
      description:
        'Marine-citrus freshness with a musky woody dry down. Great for hot climates.',
      category: 'men',
      price: 799,
      discount: 0,
      stock: 65,
      images: img('villain hydra perfume'),
      fragranceNotes: {
        top: 'Lime, Bergamot',
        middle: 'Marine notes, Herbs',
        base: 'Cedarwood, Musk',
      },
      size: '100ml',
    },
    {
      brand: 'Ajmal',
      name: 'Carbon',
      description:
        'Citrus-aromatic with a clean soapy vibe and light woody base. Office safe.',
      category: 'men',
      price: 1499,
      discount: 5,
      stock: 55,
      images: img('ajmal carbon'),
      fragranceNotes: {
        top: 'Citrus, Lavender',
        middle: 'Clove, Violet',
        base: 'Woody notes, Musk',
      },
      size: '100ml',
    },
    {
      brand: 'Nautica',
      name: 'Voyage',
      description:
        'Crisp green apple and aquatic notes over a musky woody base. Affordable best-seller.',
      category: 'men',
      price: 2200,
      discount: 10,
      stock: 95,
      images: img('nautica voyage'),
      fragranceNotes: {
        top: 'Green apple, Leafy notes',
        middle: 'Lotus, Aquatic notes',
        base: 'Musk, Cedar, Amber',
      },
      size: '100ml',
    },
  ];

  return items.map((p) => ({
    ...p,
    seller: sellerId,
    isApproved: true,
    isActive: true,
    slug: slugify(`${p.brand}-${p.name}`),
  }));
}

async function upsertProducts(products) {
  for (const p of products) {
    await Product.findOneAndUpdate(
      { brand: p.brand, name: p.name },
      { $set: p, $setOnInsert: { rating: { average: 0, count: 0 } } },
      { upsert: true, new: true }
    );
  }
}

async function main() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(MONGO_URI);
  console.log('Connected');

  try {
    const seller = await ensureSeller();
    const data = productsData(seller._id);
    await upsertProducts(data);
    console.log('Demo products added successfully');
  } catch (err) {
    console.error('Seeding error:', err);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

main();
