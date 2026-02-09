import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../utils/axios'

export default function SellerDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/seller/analytics').then(({ data }) => {
      setStats(data.stats)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  if (loading) return <div className="text-gray-500">Loading...</div>
  if (!stats) return <div className="text-red-500">Failed to load dashboard.</div>

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Seller Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-500 text-sm">Total Products</p>
          <p className="text-2xl font-bold text-primary-600">{stats.totalProducts}</p>
          <p className="text-xs text-gray-400">Active: {stats.activeProducts}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-500 text-sm">Total Orders</p>
          <p className="text-2xl font-bold text-primary-600">{stats.totalOrders}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-500 text-sm">Total Revenue</p>
          <p className="text-2xl font-bold text-green-600">₹{stats.totalRevenue?.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-500 text-sm">Commission Paid</p>
          <p className="text-2xl font-bold text-gray-700">₹{stats.totalCommission?.toLocaleString()}</p>
        </div>
      </div>
      <div className="flex gap-4">
        <Link to="/seller/products/add" className="btn-primary">Add Product</Link>
        <Link to="/seller/orders" className="btn-secondary">View Orders</Link>
      </div>
    </div>
  )
}
