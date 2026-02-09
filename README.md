# 🚀 AromaMart - Premium Perfume Marketplace

A full-stack MERN (MongoDB, Express, React, Node.js) multi-vendor perfume marketplace platform.

## 📋 Features

### Customer Features
- User registration and authentication (Email/Password + Google OAuth)
- Browse perfumes by brand, category, price, and rating
- Advanced filtering and search
- Product detail pages with fragrance notes
- Shopping cart and wishlist
- Secure checkout with Razorpay payment integration
- Order tracking and history
- Product reviews and ratings

### Seller/Brand Features
- Seller registration and approval system
- Product management (CRUD operations)
- Sales analytics dashboard
- Order management
- Brand profile customization
- Commission tracking

### Admin Features
- User and seller management
- Product approval system
- Order management
- Platform analytics
- Commission management
- Dispute resolution

## 🛠️ Tech Stack

### Frontend
- React.js 18
- Redux Toolkit for state management
- React Router for navigation
- TailwindCSS for styling
- Axios for API calls
- Vite as build tool

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT authentication
- Razorpay payment integration
- Cloudinary for image uploads

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account or local MongoDB
- Cloudinary account
- Razorpay account

### Check local MongoDB (optional)
- **Windows**: Services → "MongoDB Server", or run `mongod` from install path.
- **Mac**: `brew services list` or run `mongod`.
- **Linux**: `sudo systemctl status mongod`.  
For Atlas setup, see **docs/MONGODB_ATLAS_SETUP.md**.

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
FRONTEND_URL=http://localhost:3000
COMMISSION_PERCENTAGE=15
```

4. Start the server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

4. Start the development server:
```bash
npm run dev
```

## 🚀 Deployment

### Backend Deployment (Render/Railway/AWS)

1. Push code to GitHub
2. Connect repository to Render/Railway
3. Set environment variables
4. Deploy

### Frontend Deployment (Vercel)

1. Push code to GitHub
2. Import project to Vercel
3. Set environment variables
4. Deploy

## 📁 Project Structure

```
project1/
├── backend/
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── middleware/      # Auth middleware
│   ├── utils/           # Utility functions
│   └── server.js        # Entry point
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── store/       # Redux store
│   │   └── utils/       # Utility functions
│   └── package.json
└── README.md
```

## 🔐 Default Admin Account

Create an admin user manually in MongoDB:

```javascript
{
  "name": "Admin",
  "email": "admin@aromamart.com",
  "password": "hashed_password",
  "role": "admin"
}
```

## 📝 API Documentation

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get single product
- `GET /api/products/brand/:brandName` - Get products by brand

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:itemId` - Update cart item
- `DELETE /api/cart/:itemId` - Remove item from cart

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:orderId` - Get single order
- `POST /api/orders/:orderId/verify-payment` - Verify payment

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Built with ❤️ for AromaMart
