import { useEffect, useState } from 'react'
import api from '../../utils/axios'
import toast from 'react-hot-toast'

export default function AdminSellers() {
  const [sellers, setSellers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/admin/users?role=seller').then(({ data }) => {
      setSellers(data.users || [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const approveSeller = async (userId) => {
    try {
      const { data } = await api.put(`/admin/users/${userId}/approve-seller`)
      setSellers(prev => prev.map(s => s._id === userId ? data.user : s))
      toast.success('Seller approved')
    } catch {
      toast.error('Failed to approve')
    }
  }

  const toggleBan = async (userId) => {
    try {
      const { data } = await api.put(`/admin/users/${userId}/ban`)
      setSellers(prev => prev.map(s => s._id === userId ? data.user : s))
      toast.success(data.message)
    } catch {
      toast.error('Failed to update')
    }
  }

  if (loading) return <div className="text-gray-500">Loading...</div>

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Manage Sellers</h1>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Seller</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Brand</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sellers.length === 0 ? (
                <tr><td colSpan={4} className="px-4 py-8 text-center text-gray-500">No sellers found.</td></tr>
              ) : (
                sellers.map((s) => (
                  <tr key={s._id}>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{s.name}</p>
                      <p className="text-sm text-gray-500">{s.email}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{s.sellerInfo?.brandName || '–'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded ${s.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {s.isActive ? 'Active' : 'Banned'}
                      </span>
                      <span className={`ml-2 px-2 py-1 text-xs rounded ${s.sellerInfo?.isApproved ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {s.sellerInfo?.isApproved ? 'Approved' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {!s.sellerInfo?.isApproved && (
                        <button onClick={() => approveSeller(s._id)} className="text-green-600 hover:underline mr-3">Approve</button>
                      )}
                      <button onClick={() => toggleBan(s._id)} className="text-red-600 hover:underline">
                        {s.isActive ? 'Ban' : 'Unban'}
                      </button>
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
