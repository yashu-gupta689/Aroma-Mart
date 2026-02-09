import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../../store/slices/authSlice'
import { fetchCart } from '../../store/slices/cartSlice'
import { useEffect } from 'react'
import { FiShoppingCart, FiUser, FiLogOut, FiMenu } from 'react-icons/fi'

const Navbar = () => {
  const dispatch = useDispatch()
  const { isAuthenticated, user } = useSelector((state) => state.auth)
  const { items } = useSelector((state) => state.cart)

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart())
    }
  }, [isAuthenticated, dispatch])

  const handleLogout = () => {
    dispatch(logout())
    window.location.href = '/'
  }

  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-primary-600">
            AromaMart
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/products" className="text-gray-700 hover:text-primary-600">
              Products
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/cart" className="relative">
                  <FiShoppingCart className="text-2xl text-gray-700 hover:text-primary-600" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </Link>

                <div className="relative group">
                  <button className="flex items-center space-x-2">
                    <FiUser className="text-xl" />
                    <span>{user?.name}</span>
                  </button>
                  
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">
                      Profile
                    </Link>
                    <Link to="/orders" className="block px-4 py-2 hover:bg-gray-100">
                      Orders
                    </Link>
                    {user?.role === 'seller' && (
                      <Link to="/seller/dashboard" className="block px-4 py-2 hover:bg-gray-100">
                        Seller Dashboard
                      </Link>
                    )}
                    {user?.role === 'admin' && (
                      <Link to="/admin/dashboard" className="block px-4 py-2 hover:bg-gray-100">
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center space-x-2"
                    >
                      <FiLogOut />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-secondary">
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden">
            <FiMenu className="text-2xl" />
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
