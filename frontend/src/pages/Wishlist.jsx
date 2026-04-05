import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../utils/axios'
import toast from 'react-hot-toast'

const Wishlist = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    api.get('/wishlist').then(({ data }) => {
      setItems(data.products || [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [])

  const removeItem = async (productId) => {
    try {
      await api.delete(`/wishlist/${productId}`)
      setItems(prev => prev.filter(p => p._id !== productId))
      toast.success('Removed from wishlist')
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to remove')
    }
  }

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Wishlist</h1>
      {items.length === 0 ? (
        <div className="card">Your wishlist is empty.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(product => (
            <div key={product._id} className="card hover:shadow-xl transition-shadow">
              <Link to={`/products/${product._id}`}>
                <img
                  src={product.images?.[0] || product.image || '/placeholder.jpg'}
                  alt={product.name}
                  className="w-full h-64 object-cover rounded-lg mb-4"
                />
                <h3 className="font-semibold text-lg mb-2">{product.brand}</h3>
                <p className="text-gray-600 mb-2">{product.name}</p>
                <span className="text-2xl font-bold text-primary-600">
                  ₹{product.discountedPrice || product.price}
                </span>
              </Link>
              <div className="mt-4">
                <button className="btn-secondary" onClick={() => removeItem(product._id)}>
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Wishlist
