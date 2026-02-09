import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../utils/axios'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/admin/analytics').then(({ data }) => {
      setStats(data.stats)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  if (loading) return <div className="text-gray-500">Loading...</div>
  if (!stats) return <div className="text-red-500">Failed to load dashboard.</div>

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-500 text-sm">Total Users</p>
          <p className="text-2xl font-bold text-primary-600">{stats.totalUsers}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-500 text-sm">Sellers</p>
          <p className="text-2xl font-bold text-primary-600">{stats.totalSellers}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-500 text-sm">Total Revenue</p>
          <p className="text-2xl font-bold text-green-600">₹{stats.totalRevenue?.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-500 text-sm">Commission Earned</p>
          <p className="text-2xl font-bold text-gray-700">₹{stats.totalCommission?.toLocaleString()}</p>
        </div>
      </div>
      <div className="flex gap-4">
        <Link to="/admin/sellers" className="btn-primary">Manage Sellers</Link>
        <Link to="/admin/products" className="btn-secondary">Manage Products</Link>
        <Link to="/admin/analytics" className="btn-secondary">Revenue</Link>
      </div>
    </div>
  )
}
