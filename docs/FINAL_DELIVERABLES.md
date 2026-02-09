# Final Deliverables – AromaMart

Use this checklist when handing off or deploying the project.

---

## 1. MongoDB (Local → Atlas)

- [ ] **Local MongoDB**: Confirm it’s running (e.g. `mongod` or Windows Services).
- [ ] **Atlas**: Account created, free cluster, database **aromamart_db**, user **aromamart_admin** (password stored in `.env`).
- [ ] **Network**: Current IP whitelisted in Atlas.
- [ ] **Backend `.env`**: `MONGO_URI=mongodb+srv://aromamart_admin:<password>@cluster0....mongodb.net/aromamart_db?...`

Ref: `docs/MONGODB_ATLAS_SETUP.md`

---

## 2. Cloudinary

- [ ] Account created; **CLOUDINARY_CLOUD_NAME**, **CLOUDINARY_API_KEY**, **CLOUDINARY_API_SECRET** in backend `.env`.
- [ ] Product images, brand logos (and banners if used) upload to Cloudinary.

---

## 3. Razorpay

- [ ] Account created; Test mode used first.
- [ ] **RAZORPAY_KEY_ID** and **RAZORPAY_SECRET** in backend `.env`.
- [ ] **VITE_RAZORPAY_KEY_ID** in frontend `.env` (same Key ID).
- [ ] Create order → Razorpay opens → Pay → Verify payment; order status **PAID** on success, **FAILED** on failure.

---

## 4. Environment variables

**Backend `.env` (exact names):**

- `PORT=5000`
- `MONGO_URI=<Atlas connection string>`
- `JWT_SECRET=<secure random string>`
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- `RAZORPAY_KEY_ID`, `RAZORPAY_SECRET`
- `NODE_ENV=production` (for production)
- `FRONTEND_URL` (frontend URL for CORS)

**Frontend `.env`:**

- `VITE_API_URL=https://your-backend-url.com/api` (or `REACT_APP_BACKEND_URL` if using CRA)
- `VITE_RAZORPAY_KEY_ID=your_razorpay_key_id`

---

## 5. Seller & Admin dashboards (completed)

- [ ] **Seller**: Sidebar (Dashboard, My Products, Add Product, Orders, Analytics). Add Product form, My Products table (Edit/Delete), Orders (Mark Shipped/Delivered), Analytics (sales, revenue, best-selling).
- [ ] **Admin**: Sidebar (Dashboard, Users, Sellers, Products, Orders, Revenue). Manage Sellers (Approve/Reject, Ban), Manage Products (Approve/Reject/Delete), Revenue (total revenue, commission, sales graph / monthly + best-selling).

---

## 6. Testing (mandatory)

- [ ] Run through `docs/TESTING_CHECKLIST.md`: registration, login, cart, checkout, payment, seller upload, admin approval, image uploads, order tracking, error handling.
- [ ] Fix any bugs before deployment.

---

## 7. Production deployment

**Backend (Render / Railway / AWS):**

- [ ] Repo on GitHub; connected to Render (or Railway/AWS).
- [ ] All backend env vars set.
- [ ] Deploy; **live backend URL** noted.

**Frontend (Vercel):**

- [ ] Frontend repo on GitHub; imported in Vercel.
- [ ] `VITE_API_URL` = live backend URL + `/api`; `VITE_RAZORPAY_KEY_ID` set.
- [ ] Deploy; **live website URL** noted.

---

## 8. What to provide back

1. **GitHub repository** (backend + frontend or monorepo).
2. **API documentation** (e.g. README or `docs/` with endpoints).
3. **Deployment links**:
   - Backend: `https://your-backend.onrender.com` (or similar).
   - Frontend: `https://your-app.vercel.app` (or similar).
4. **Admin credentials** (store securely; share only over a secure channel):
   - Email: `admin@aromamart.com` (or your chosen email).
   - Password: (the one you set when creating admin in DB).
5. **Demo video** (optional but recommended): short walkthrough of registration, login, add to cart, checkout, seller add product, admin approval.

---

## Quick commands

**Backend:**  
`cd backend && npm install && cp .env.example .env` → edit `.env` → `npm run dev`

**Frontend:**  
`cd frontend && npm install && cp .env.example .env` → edit `.env` → `npm run dev`

**Create admin (once DB is running):**  
Use MongoDB Compass/Atlas or a small script to insert a user with `role: 'admin'` and bcrypt-hashed password.
