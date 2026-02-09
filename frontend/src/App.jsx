import { Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { loadUser } from './store/slices/authSlice'

// Layout Components
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import SellerLayout from './components/layout/SellerLayout'
import AdminLayout from './components/layout/AdminLayout'

// Public Routes
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'

// Protected Routes
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Orders from './pages/Orders'
import OrderDetail from './pages/OrderDetail'
import Profile from './pages/Profile'
import Wishlist from './pages/Wishlist'

// Seller Routes
import SellerDashboard from './pages/seller/Dashboard'
import SellerProducts from './pages/seller/Products'
import SellerAddProduct from './pages/seller/AddProduct'
import SellerEditProduct from './pages/seller/EditProduct'
import SellerOrders from './pages/seller/Orders'
import SellerAnalytics from './pages/seller/Analytics'

// Admin Routes
import AdminDashboard from './pages/admin/Dashboard'
import AdminUsers from './pages/admin/Users'
import AdminSellers from './pages/admin/Sellers'
import AdminProducts from './pages/admin/Products'
import AdminOrders from './pages/admin/Orders'
import AdminAnalytics from './pages/admin/Analytics'

// Protected Route Component
import ProtectedRoute from './components/auth/ProtectedRoute'

function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    // Load user from localStorage on app start
    const token = localStorage.getItem('token')
    if (token) {
      dispatch(loadUser())
    }
  }, [dispatch])

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Customer Routes */}
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders/:orderId"
            element={
              <ProtectedRoute>
                <OrderDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wishlist"
            element={
              <ProtectedRoute>
                <Wishlist />
              </ProtectedRoute>
            }
          />

          {/* Seller Routes */}
          <Route
            path="/seller"
            element={
              <ProtectedRoute allowedRoles={['seller', 'admin']}>
                <SellerLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<SellerDashboard />} />
            <Route path="dashboard" element={<SellerDashboard />} />
            <Route path="products" element={<SellerProducts />} />
            <Route path="products/add" element={<SellerAddProduct />} />
            <Route path="products/edit/:productId" element={<SellerEditProduct />} />
            <Route path="orders" element={<SellerOrders />} />
            <Route path="analytics" element={<SellerAnalytics />} />
          </Route>

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="sellers" element={<AdminSellers />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="analytics" element={<AdminAnalytics />} />
          </Route>
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
