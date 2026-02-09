import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { fetchProducts } from '../store/slices/productSlice'
import { FiStar, FiShoppingCart } from 'react-icons/fi'

const Home = () => {
  const dispatch = useDispatch()
  const { products, loading } = useSelector((state) => state.products)

  useEffect(() => {
    dispatch(fetchProducts({ featured: 'true', limit: 8 }))
  }, [dispatch])

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Discover Your Signature Scent</h1>
          <p className="text-xl mb-8">Premium perfumes from world-renowned brands</p>
          <Link to="/products" className="btn-primary bg-white text-primary-600 hover:bg-gray-100">
            Shop Now
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8">Featured Products</h2>
        
        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.slice(0, 8).map((product) => (
              <div key={product._id} className="card hover:shadow-xl transition-shadow">
                <Link to={`/products/${product._id}`}>
                  <img
                    src={product.images[0] || '/placeholder.jpg'}
                    alt={product.name}
                    className="w-full h-64 object-cover rounded-lg mb-4"
                  />
                  <h3 className="font-semibold text-lg mb-2">{product.brand}</h3>
                  <p className="text-gray-600 mb-2">{product.name}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-primary-600">
                        ₹{product.discountedPrice || product.price}
                      </span>
                      {product.discount > 0 && (
                        <span className="text-gray-500 line-through ml-2">
                          ₹{product.price}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center">
                      <FiStar className="text-yellow-400 mr-1" />
                      <span>{product.rating?.average || 0}</span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-8">
          <Link to="/products" className="btn-primary">
            View All Products
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {['men', 'women', 'unisex', 'niche'].map((category) => (
              <Link
                key={category}
                to={`/products?category=${category}`}
                className="card text-center hover:shadow-lg transition-shadow"
              >
                <h3 className="text-xl font-semibold capitalize">{category}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
