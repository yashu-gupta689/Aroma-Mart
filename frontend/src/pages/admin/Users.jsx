import { useEffect, useState } from 'react'
import api from '../../utils/axios'
import toast from 'react-hot-toast'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [roleFilter, setRoleFilter] = useState('')

  useEffect(() => {
    const params = roleFilter ? { role: roleFilter } : {}
    api.get('/admin/users', { params }).then(({ data }) => {
      setUsers(data.users || [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [roleFilter])

  const toggleBan = async (userId) => {
    try {
      const { data } = await api.put(`/admin/users/${userId}/ban`)
      setUsers(prev => prev.map(u => u._id === userId ? data.user : u))
      toast.success(data.message)
    } catch {
      toast.error('Failed to update')
    }
  }

  if (loading) return <div className="text-gray-500">Loading...</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="input-field w-40">
          <option value="">All</option>
          <option value="customer">Customer</option>
          <option value="seller">Seller</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-500">No users found.</td></tr>
              ) : (
                users.map((u) => (
                  <tr key={u._id}>
                    <td className="px-4 py-3 font-medium text-gray-900">{u.name}</td>
                    <td className="px-4 py-3 text-gray-600">{u.email}</td>
                    <td className="px-4 py-3 capitalize">{u.role}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded ${u.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {u.isActive ? 'Active' : 'Banned'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {u.role !== 'admin' && (
                        <button onClick={() => toggleBan(u._id)} className="text-red-600 hover:underline">
                          {u.isActive ? 'Ban' : 'Unban'}
                        </button>
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
