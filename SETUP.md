# 🚀 AromaMart Setup Guide

## Quick Start

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your credentials
npm run dev
```

### 2. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with your API URL and Razorpay key
npm run dev
```

## Required Services

### MongoDB Atlas
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create a cluster (free tier available)
3. Get connection string
4. Add to `backend/.env` as `MONGODB_URI`

### Cloudinary
1. Create account at https://cloudinary.com
2. Get Cloud Name, API Key, and API Secret
3. Add to `backend/.env`

### Razorpay
1. Create account at https://razorpay.com
2. Get Key ID and Key Secret from dashboard
3. Add to `backend/.env` and `frontend/.env`

## Creating Admin User

After setting up MongoDB, create an admin user:

```javascript
// In MongoDB shell or Compass
use aromamart
db.users.insertOne({
  name: "Admin",
  email: "admin@aromamart.com",
  password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYqJ5q5q5q5", // password: admin123
  role: "admin",
  isActive: true,
  createdAt: new Date()
})
```

Or use bcrypt to hash your password:
```bash
node -e "const bcrypt=require('bcryptjs');console.log(bcrypt.hashSync('yourpassword',12))"
```

## Testing the Application

1. Start backend: `cd backend && npm run dev`
2. Start frontend: `cd frontend && npm run dev`
3. Open http://localhost:3000
4. Register as customer or seller
5. Login and start exploring!

## Common Issues

### CORS Error
- Ensure `FRONTEND_URL` in backend `.env` matches your frontend URL
- Check CORS middleware in `backend/server.js`

### Razorpay Not Loading
- Ensure Razorpay script loads in Checkout page
- Check browser console for errors
- Verify `VITE_RAZORPAY_KEY_ID` in frontend `.env`

### Image Upload Fails
- Verify Cloudinary credentials in backend `.env`
- Check file size (max 5MB)
- Ensure image format is jpg/png/webp

### MongoDB Connection Error
- Verify connection string format
- Check IP whitelist in MongoDB Atlas
- Ensure network access is enabled

## Production Deployment

### Backend (Render/Railway)
1. Connect GitHub repository
2. Set environment variables
3. Set build command: `npm install`
4. Set start command: `npm start`

### Frontend (Vercel)
1. Import GitHub repository
2. Set framework preset: Vite
3. Set environment variables
4. Deploy

## Support

For issues or questions, please open an issue on GitHub.
