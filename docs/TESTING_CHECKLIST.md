# AromaMart – Full Application Testing Checklist

Use this list before deployment. Fix any failing item.

---

## 1. User registration & login

| # | Test | Steps | Expected |
|---|------|--------|----------|
| 1.1 | Customer registration | Register with email/password as Customer | Account created, redirected, token stored |
| 1.2 | Seller registration | Register with email/password as Seller | Account created; seller pending approval |
| 1.3 | Login | Login with registered email/password | Redirected to home, cart/orders accessible |
| 1.4 | Invalid login | Wrong password or email | Error message, no redirect |
| 1.5 | Protected route | Open /cart or /orders without login | Redirect to /login |

---

## 2. Add to cart & checkout

| # | Test | Steps | Expected |
|---|------|--------|----------|
| 2.1 | Add to cart | Product page → Add to Cart (signed in) | Cart count updates, item in cart |
| 2.2 | Cart without login | Add to cart when not logged in | Prompt to login or redirect to login |
| 2.3 | Update quantity | Cart page: change quantity | Subtotal and total update |
| 2.4 | Remove item | Cart page: remove item | Item removed, totals update |
| 2.5 | Checkout | Cart → Checkout → fill address → Pay | Order created; Razorpay opens (if Razorpay) |
| 2.6 | Payment success | Complete Razorpay payment | Order status PAID/confirmed; order in Orders list |
| 2.7 | Payment failure | Cancel or fail payment | Order remains pending/failed; no double charge |

---

## 3. Seller product upload & dashboard

| # | Test | Steps | Expected |
|---|------|--------|----------|
| 3.1 | Seller login | Login as approved seller | Can open /seller/dashboard |
| 3.2 | Add product | Seller → Add Product → fill form, upload images | Success message; product in My Products (pending) |
| 3.3 | Image upload | Add product with 1–5 images | Images visible on product (or in list) and stored (e.g. Cloudinary) |
| 3.4 | My Products list | Seller → My Products | Table with image, name, price, stock, status |
| 3.5 | Edit product | My Products → Edit → change fields → Save | Product updated; may show “pending approval” |
| 3.6 | Delete product | My Products → Delete | Product removed or deactivated; list updates |
| 3.7 | Seller orders | Seller → Orders | Only that seller’s orders listed |
| 3.8 | Mark shipped | Orders → Mark as Shipped (optional tracking) | Order status = shipped |
| 3.9 | Mark delivered | Orders → Mark as Delivered | Order status = delivered |
| 3.10 | Analytics | Seller → Analytics | Total sales, revenue, monthly sales, best-selling products |

---

## 4. Admin approval & management

| # | Test | Steps | Expected |
|---|------|--------|----------|
| 4.1 | Admin login | Login as admin | Can open /admin/dashboard |
| 4.2 | Manage sellers | Admin → Sellers | List of sellers; Approve for pending | Seller becomes approved |
| 4.3 | Ban/unban user | Admin → Users → Ban | User banned; Unban restores |
| 4.4 | Manage products | Admin → Products | All products; filter “Pending approval” |
| 4.5 | Approve product | Products → Approve | Product approved and visible on storefront |
| 4.6 | Reject product | Products → Reject | Product rejected/deactivated |
| 4.7 | Admin orders | Admin → Orders | All orders; status dropdown works |
| 4.8 | Revenue dashboard | Admin → Revenue/Analytics | Total revenue, commission, monthly revenue, best-selling products |

---

## 5. Image uploads (Cloudinary)

| # | Test | Steps | Expected |
|---|------|--------|----------|
| 5.1 | Product images | Add/Edit product with images | Images upload; URLs from Cloudinary |
| 5.2 | Brand logo | Seller profile → upload brand logo | Logo saved and displayed where used |
| 5.3 | Invalid file | Upload non-image (e.g. .pdf) | Rejected with error message |

---

## 6. Order tracking & error handling

| # | Test | Steps | Expected |
|---|------|--------|----------|
| 6.1 | Order list | Customer → Orders | All orders with status and amount |
| 6.2 | Order detail | Orders → one order | Full details, address, items, status |
| 6.3 | Order status flow | Place order → Pay → Seller marks Shipped → Delivered | Status updates at each step |
| 6.4 | API error | Stop backend, trigger any API call | Frontend shows error (toast/message), no crash |
| 6.5 | 401 handling | Remove token, refresh or call API | Redirect to login |

---

## 7. Environment & config

| # | Test | Steps | Expected |
|---|------|--------|----------|
| 7.1 | Backend env | Backend has MONGO_URI, JWT_SECRET, Cloudinary, Razorpay | Server starts; DB connects; no “undefined” in logs |
| 7.2 | Frontend env | VITE_API_URL and VITE_RAZORPAY_KEY_ID set | API calls hit correct backend; Razorpay opens |
| 7.3 | CORS | Frontend (different origin) calls backend | No CORS errors in browser console |

---

## Sign-off

- [ ] All items above passed or documented as known issues.
- [ ] Payment tested in Razorpay Test Mode.
- [ ] At least one full flow: Register → Login → Add to cart → Checkout → Pay → Order visible → Seller/Admin see order.

**Tester:** _________________ **Date:** _________________
