import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProduct, clearProduct } from '../store/slices/productSlice'
import { addToCart } from '../store/slices/cartSlice'
import { FiStar, FiShoppingCart, FiHeart } from 'react-icons/fi'
import toast from 'react-hot-toast'
import api from '../utils/axios'

const ProductDetail = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { product, similarProducts, loading } = useSelector((state) => state.products)
  const { isAuthenticated } = useSelector((state) => state.auth)
  
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState('100ml')
  const [selectedImage, setSelectedImage] = useState(0)
  const [reviews, setReviews] = useState([])
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    dispatch(fetchProduct(id))
    return () => dispatch(clearProduct())
  }, [dispatch, id])

  useEffect(() => {
    api.get(`/reviews/product/${id}`)
      .then(({ data }) => setReviews(data || []))
      .catch(() => setReviews([]))
  }, [id])

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart')
      return
    }
    dispatch(addToCart({ productId: id, quantity, size: selectedSize }))
    toast.success('Added to cart!')
  }

  const handleAddWishlist = async () => {
    try {
      await api.post('/wishlist', { productId: id })
      toast.success('Added to wishlist')
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to add to wishlist')
    }
  }

  const submitReview = async (e) => {
    e.preventDefault()
    if (!isAuthenticated) {
      toast.error('Please login to write a review')
      return
    }
    if (!comment.trim()) {
      toast.error('Please enter your review')
      return
    }
    setSubmitting(true)
    try {
      const { data } = await api.post('/reviews', {
        productId: id,
        rating,
        comment,
      })
      toast.success('Review submitted')
      // Refresh list
      const res = await api.get(`/reviews/product/${id}`)
      setReviews(res.data || [])
      setComment('')
      setRating(5)
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to submit review')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading || !product) {
    return <div className="container mx-auto px-4 py-12 text-center">Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div>
          <img
            src={product.images?.[selectedImage] || product.images?.[0] || product.image || '/placeholder.jpg'}
            alt={product.name}
            className="w-full h-96 object-cover rounded-lg mb-4"
          />
          <div className="flex gap-2">
            {(product.images || []).map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`${product.name} ${idx + 1}`}
                onClick={() => setSelectedImage(idx)}
                className={`w-20 h-20 object-cover rounded cursor-pointer border-2 ${
                  selectedImage === idx ? 'border-primary-600' : 'border-transparent'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.brand}</h1>
          <h2 className="text-2xl text-gray-600 mb-4">{product.name}</h2>
          
          <div className="flex items-center mb-4">
            <div className="flex items-center mr-4">
              <FiStar className="text-yellow-400 mr-1" />
              <span className="font-semibold">{product.rating?.average || 0}</span>
              <span className="text-gray-500 ml-1">
                ({product.rating?.count || 0} reviews)
              </span>
            </div>
          </div>

          <div className="mb-6">
            <span className="text-3xl font-bold text-primary-600">
              ₹{product.discountedPrice || product.price}
            </span>
            {product.discount > 0 && (
              <>
                <span className="text-gray-500 line-through ml-2 text-xl">
                  ₹{product.price}
                </span>
                <span className="text-green-600 ml-2 font-semibold">
                  {product.discount}% OFF
                </span>
              </>
            )}
          </div>

          {/* Size Selection */}
          <div className="mb-6">
            <label className="block font-medium mb-2">Size</label>
            <div className="flex gap-2">
              {['30ml', '50ml', '100ml', '200ml'].map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 border rounded ${
                    selectedSize === size
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-300'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="mb-6">
            <label className="block font-medium mb-2">Quantity</label>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-2 border rounded"
              >
                -
              </button>
              <span className="text-xl">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="px-4 py-2 border rounded"
              >
                +
              </button>
              <span className="text-gray-500">({product.stock} available)</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 mb-8">
            <button onClick={handleAddToCart} className="btn-primary flex-1 flex items-center justify-center space-x-2">
              <FiShoppingCart />
              <span>Add to Cart</span>
            </button>
            <button className="btn-secondary p-3">
              <FiHeart />
            </button>
          </div>

          {/* Fragrance Notes */}
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Fragrance Notes</h3>
            <div className="space-y-2">
              <div>
                <span className="font-medium">Top Notes: </span>
                <span>{product.fragranceNotes?.top}</span>
              </div>
              <div>
                <span className="font-medium">Middle Notes: </span>
                <span>{product.fragranceNotes?.middle}</span>
              </div>
              <div>
                <span className="font-medium">Base Notes: </span>
                <span>{product.fragranceNotes?.base}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-gray-600">{product.description}</p>
          </div>
          
          <div className="flex items-center gap-3 mt-6">
            <button className="btn-primary flex items-center gap-2" onClick={handleAddWishlist}>
              <FiHeart /> <span>Add to Wishlist</span>
            </button>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
        {reviews.length === 0 ? (
          <div className="card">No reviews yet. Be the first to review!</div>
        ) : (
          <div className="space-y-4">
            {reviews.map((r) => (
              <div key={r._id} className="card">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <FiStar className="text-yellow-400" />
                    <span className="font-semibold">{r.rating}/5</span>
                  </div>
                  <span className="text-sm text-gray-500">{r.user?.name || 'User'}</span>
                </div>
                <p className="text-gray-700">{r.comment}</p>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6">
          <h3 className="font-semibold mb-2">Write a Review</h3>
          <form onSubmit={submitReview} className="space-y-3">
            <div>
              <label className="block text-sm mb-1">Rating</label>
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="input-field w-40"
              >
                {[5,4,3,2,1].map(v => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">Comment</label>
              <textarea
                className="input-field w-full"
                rows="3"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience"
              />
            </div>
            <button type="submit" disabled={submitting} className="btn-primary">
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        </div>
      </div>

      {/* Similar Products */}
      {similarProducts.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Similar Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {similarProducts.map((product) => (
              <a
                key={product._id}
                href={`/products/${product._id}`}
                className="card hover:shadow-xl transition-shadow"
              >
                <img
                  src={product.images?.[0] || product.image || '/placeholder.jpg'}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h3 className="font-semibold">{product.brand}</h3>
                <p className="text-gray-600 text-sm mb-2">{product.name}</p>
                <span className="text-xl font-bold text-primary-600">
                  ₹{product.discountedPrice || product.price}
                </span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductDetail
