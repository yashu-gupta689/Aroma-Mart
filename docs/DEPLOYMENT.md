# AromaMart – Production Deployment Guide

## Backend (Render / Railway / AWS)

### Option A: Render

1. **Push backend to GitHub**  
   - Only backend folder: either a separate repo or a monorepo with `backend/` as root in that repo.

2. **Create Web Service**
   - Render Dashboard → New → Web Service.
   - Connect the repo (and set root to `backend` if needed).
   - Runtime: **Node**.
   - Build command: `npm install`
   - Start command: `npm start`
   - Instance: Free or paid.

3. **Environment variables** (Render → Environment)
   - `PORT` (Render sets this; you can leave it or set `5000`).
   - `MONGO_URI` = your Atlas connection string (e.g. `mongodb+srv://aromamart_admin:...@cluster0....mongodb.net/aromamart_db?...`).
   - `JWT_SECRET` = long random string.
   - `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
   - `RAZORPAY_KEY_ID`, `RAZORPAY_SECRET`
   - `FRONTEND_URL` = your Vercel frontend URL (e.g. `https://aromamart.vercel.app`).
   - `NODE_ENV=production`

4. **Deploy**  
   - Save; Render builds and deploys.  
   - Note the backend URL, e.g. `https://aromamart-api.onrender.com`.

---

### Option B: Railway

1. **New project** → Deploy from GitHub repo (backend).
2. **Variables**: Add the same as in Render (MONGO_URI, JWT_SECRET, Cloudinary, Razorpay, FRONTEND_URL, NODE_ENV).
3. **Settings**: Build command `npm install`, start command `npm start`.
4. **Deploy** and copy the generated backend URL.

---

## Frontend (Vercel)

1. **Push frontend to GitHub** (e.g. repo root = `frontend` or project root with `frontend/`).

2. **Vercel**
   - Import project from GitHub.
   - Framework Preset: **Vite**.
   - Root Directory: `frontend` (if app is inside `frontend/`).
   - Build command: `npm run build`
   - Output directory: `dist`

3. **Environment variables**
   - `VITE_API_URL` = backend URL + `/api` (e.g. `https://aromamart-api.onrender.com/api`).
   - `VITE_RAZORPAY_KEY_ID` = same key as backend (Razorpay dashboard).

4. **Deploy**  
   - Deploy; Vercel gives you a URL, e.g. `https://aromamart.vercel.app`.

---

## Post-deployment

1. **Backend CORS**  
   In backend, ensure `FRONTEND_URL` or `cors` config includes your Vercel URL so browser allows requests.

2. **Razorpay**  
   - Test mode: use Test Key ID and Secret.  
   - Live: replace with Live Key ID and Secret in both backend and frontend env.

3. **Admin user**  
   Create an admin in MongoDB (e.g. via Atlas or a one-time script) with `role: 'admin'` and a hashed password.

4. **Final deliverables**
   - Backend live URL (e.g. `https://aromamart-api.onrender.com`).
   - Frontend live URL (e.g. `https://aromamart.vercel.app`).
   - Admin credentials (store securely; share only over a secure channel).
   - Optional: short demo video and API doc link.

---

## Env summary

**Backend (.env on server)**  
`PORT`, `MONGO_URI`, `JWT_SECRET`, `JWT_EXPIRE`, `CLOUDINARY_*`, `RAZORPAY_KEY_ID`, `RAZORPAY_SECRET`, `FRONTEND_URL`, `NODE_ENV`, `COMMISSION_PERCENTAGE` (optional).

**Frontend (Vercel env)**  
`VITE_API_URL`, `VITE_RAZORPAY_KEY_ID`.
