import { useEffect, useState } from 'react'
import api from '../../utils/axios'
import toast from 'react-hot-toast'

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('') // '' | 'pending'

  useEffect(() => {
    const params = filter === 'pending' ? { approved: 'false' } : {}
    api.get('/admin/products', { params }).then(({ data }) => {
      setProducts(data.products || [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [filter])

  const approve = async (productId) => {
    try {
      const { data } = await api.put(`/admin/products/${productId}/approve`)
      setProducts(prev => prev.map(p => p._id === productId ? data.product : p))
      toast.success('Product approved')
    } catch {
      toast.error('Failed to approve')
    }
  }

  const reject = async (productId) => {
    if (!window.confirm('Reject and deactivate this product?')) return
    try {
      await api.put(`/admin/products/${productId}/reject`)
      setProducts(prev => prev.filter(p => p._id !== productId))
      toast.success('Product rejected')
    } catch {
      toast.error('Failed to reject')
    }
  }

  if (loading) return <div className="text-gray-500">Loading...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Products</h1>
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="input-field w-48">
          <option value="">All products</option>
          <option value="pending">Pending approval</option>
        </select>
      </div>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Seller</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-500">No products found.</td></tr>
              ) : (
                products.map((p) => (
                  <tr key={p._id}>
                    <td className="px-4 py-3">
                      <img src={p.images?.[0]} alt={p.name} className="w-12 h-12 object-cover rounded" />
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{p.name}</p>
                      <p className="text-sm text-gray-500">{p.brand}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{p.seller?.sellerInfo?.brandName || p.seller?.email || '–'}</td>
                    <td className="px-4 py-3">₹{p.price}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded ${p.isApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {p.isApproved ? 'Approved' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {!p.isApproved && (
                        <>
                          <button onClick={() => approve(p._id)} className="text-green-600 hover:underline mr-3">Approve</button>
                          <button onClick={() => reject(p._id)} className="text-red-600 hover:underline">Reject</button>
                        </>
                      )}
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
