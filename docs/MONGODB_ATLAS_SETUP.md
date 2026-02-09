# MongoDB Atlas Setup (AromaMart)

## 1. Confirm local MongoDB (optional)

If you use local MongoDB first:

- **Windows**: Check Services for "MongoDB Server" or run `mongod` from install path.
- **Mac**: `brew services list` or `mongod`.
- **Linux**: `sudo systemctl status mongod`.

Default local URI: `mongodb://localhost:27017/aromamart_db`

---

## 2. Create MongoDB Atlas account

1. Go to [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas).
2. Sign up or log in.
3. Create a **free cluster** (e.g. M0).
4. Choose a region close to you.

---

## 3. Database and user

1. **Database name**: Use **`aromamart_db`** when connecting (you can set it in the connection string).
2. **Create a database user**:
   - Security → Database Access → Add New Database User.
   - Authentication: Password.
   - Username: `aromamart_admin`
   - Password: Generate a secure password and **store it in `.env`** (e.g. in a password manager).
   - Role: Atlas Admin or Read and write to any database.

---

## 4. Network access (whitelist IP)

1. Security → Network Access → Add IP Address.
2. For development: **Add Your Current IP Address**.
3. For production: add the IP of your backend server (e.g. Render/Railway) or use `0.0.0.0/0` (allow from anywhere) if your host does not provide a fixed IP.

---

## 5. Connection string

1. Clusters → Connect → Connect your application.
2. Copy the connection string. It looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
3. Replace `<username>` with `aromamart_admin`.
4. Replace `<password>` with your database user password (special characters must be URL-encoded).
5. Add database name: before `?` add `/aromamart_db`:
   ```
   mongodb+srv://aromamart_admin:<password>@cluster0.xxxxx.mongodb.net/aromamart_db?retryWrites=true&w=majority
   ```

---

## 6. Backend `.env`

In `backend/.env`:

```env
MONGO_URI=mongodb+srv://aromamart_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/aromamart_db?retryWrites=true&w=majority
```

Use the same variable name in production and point it to this Atlas URI.

---

## 7. Verify

1. Start backend: `cd backend && npm run dev`.
2. You should see: `✅ MongoDB Connected`.
3. Create a user via Register and check in Atlas: Collections → aromamart_db → users.

You’re done. For production, use the same `MONGO_URI` in your hosting environment variables.
