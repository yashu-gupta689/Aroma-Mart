import { useEffect, useState } from 'react'
import api from '../../utils/axios'

export default function AdminAnalytics() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/admin/analytics').then(({ data: res }) => {
      setData(res)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  if (loading) return <div className="text-gray-500">Loading...</div>
  if (!data) return <div className="text-red-500">Failed to load analytics.</div>

  const { stats } = data
  const monthlyEntries = stats.monthlyRevenue ? Object.entries(stats.monthlyRevenue) : []
  const bestSelling = stats.bestSellingProducts || []

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Revenue Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-500 text-sm">Total Revenue</p>
          <p className="text-2xl font-bold text-green-600">₹{stats.totalRevenue?.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-500 text-sm">Commission Earned</p>
          <p className="text-2xl font-bold text-primary-600">₹{stats.totalCommission?.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-500 text-sm">Total Orders</p>
          <p className="text-2xl font-bold text-gray-700">{stats.totalOrders}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-500 text-sm">Total Products</p>
          <p className="text-2xl font-bold text-gray-700">{stats.totalProducts}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Monthly Revenue</h2>
          {monthlyEntries.length === 0 ? (
            <p className="text-gray-500">No revenue data yet.</p>
          ) : (
            <ul className="space-y-2">
              {monthlyEntries.map(([month, amount]) => (
                <li key={month} className="flex justify-between">
                  <span>{month}</span>
                  <span className="font-medium text-green-600">₹{Number(amount).toLocaleString()}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Best-Selling Products</h2>
          {bestSelling.length === 0 ? (
            <p className="text-gray-500">No data yet.</p>
          ) : (
            <ul className="space-y-2">
              {bestSelling.map((item, i) => (
                <li key={item.productId || i} className="flex justify-between text-sm">
                  <span>{item.brand} – {item.name}</span>
                  <span className="font-medium">{item.quantity} sold</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
