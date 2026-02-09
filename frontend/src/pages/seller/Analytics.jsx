import { useEffect, useState } from 'react'
import api from '../../utils/axios'

export default function SellerAnalytics() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/seller/analytics').then(({ data: res }) => {
      setData(res)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  if (loading) return <div className="text-gray-500">Loading...</div>
  if (!data) return <div className="text-red-500">Failed to load analytics.</div>

  const { stats } = data
  const monthlyEntries = stats.monthlySales ? Object.entries(stats.monthlySales) : []
  const bestSelling = stats.bestSellingProducts || []

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Analytics</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-500 text-sm">Total Sales (orders)</p>
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
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-500 text-sm">Active Products</p>
          <p className="text-2xl font-bold text-primary-600">{stats.activeProducts} / {stats.totalProducts}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Monthly Sales</h2>
          {monthlyEntries.length === 0 ? (
            <p className="text-gray-500">No sales data yet.</p>
          ) : (
            <ul className="space-y-2">
              {monthlyEntries.map(([month, count]) => (
                <li key={month} className="flex justify-between">
                  <span>{month}</span>
                  <span className="font-medium">{count} orders</span>
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
