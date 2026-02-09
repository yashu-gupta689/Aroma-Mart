import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../utils/axios'
import toast from 'react-hot-toast'

export default function SellerProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/seller/products').then(({ data }) => {
      setProducts(data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return
    try {
      await api.delete(`/seller/products/${id}`)
      setProducts(prev => prev.filter(p => p._id !== id))
      toast.success('Product deleted')
    } catch {
      toast.error('Failed to delete')
    }
  }

  if (loading) return <div className="text-gray-500">Loading...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Products</h1>
        <Link to="/seller/products/add" className="btn-primary">Add Product</Link>
      </div>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Brand</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-500">No products yet. Add your first product.</td></tr>
              ) : (
                products.map((p) => (
                  <tr key={p._id}>
                    <td className="px-4 py-3">
                      <img src={p.images?.[0]} alt={p.name} className="w-12 h-12 object-cover rounded" />
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">{p.name}</td>
                    <td className="px-4 py-3 text-gray-600">{p.brand}</td>
                    <td className="px-4 py-3">₹{p.discountedPrice ?? p.price}</td>
                    <td className="px-4 py-3">{p.stock}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded ${p.isApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {p.isApproved ? 'Approved' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link to={`/seller/products/edit/${p._id}`} className="text-primary-600 hover:underline mr-3">Edit</Link>
                      <button type="button" onClick={() => handleDelete(p._id, p.name)} className="text-red-600 hover:underline">Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
