import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { fetchProducts } from '../store/slices/productSlice'
import { FiStar, FiFilter } from 'react-icons/fi'

const Products = () => {
  const dispatch = useDispatch()
  const { products, pagination, loading } = useSelector((state) => state.products)
  
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    minRating: '',
    search: '',
    sort: '-createdAt',
    page: 1,
  })
  
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search)
    const category = queryParams.get('category') || ''
    setFilters(prev => ({ ...prev, category, page: 1 }))
  }, [window.location.search])

  useEffect(() => {
    const activeFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, v]) => v !== '')
    )
    dispatch(fetchProducts(activeFilters))
  }, [dispatch, filters])

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }))
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">All Products</h1>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="btn-secondary flex items-center space-x-2"
        >
          <FiFilter />
          <span>Filters</span>
        </button>
      </div>

      <div className="flex gap-8">
        {/* Filters Sidebar */}
        {showFilters && (
          <div className="w-64 card">
            <h3 className="font-semibold mb-4">Filters</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="input-field"
                >
                  <option value="">All</option>
                  <option value="men">Men</option>
                  <option value="women">Women</option>
                  <option value="unisex">Unisex</option>
                  <option value="niche">Niche</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Price Range</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                    className="input-field"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Minimum Rating</label>
                <select
                  value={filters.minRating}
                  onChange={(e) => handleFilterChange('minRating', e.target.value)}
                  className="input-field"
                >
                  <option value="">All</option>
                  <option value="4">4+ Stars</option>
                  <option value="3">3+ Stars</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Sort By</label>
                <select
                  value={filters.sort}
                  onChange={(e) => handleFilterChange('sort', e.target.value)}
                  className="input-field"
                >
                  <option value="-createdAt">Newest</option>
                  <option value="price">Price: Low to High</option>
                  <option value="-price">Price: High to Low</option>
                  <option value="-rating.average">Highest Rated</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="text-center py-12">Loading...</div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">No products found</div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <Link
                    key={product._id}
                    to={`/products/${product._id}`}
                    className="card hover:shadow-xl transition-shadow"
                  >
                    <img
                      src={product.images?.[0] || product.image || '/placeholder.jpg'}
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
                ))}
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="flex justify-center mt-8 space-x-2">
                  {[...Array(pagination.pages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => handleFilterChange('page', i + 1)}
                      className={`px-4 py-2 rounded ${
                        filters.page === i + 1
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-200 hover:bg-gray-300'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Products
