import { useEffect, useState } from 'react'
import api from '../../utils/axios'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(null)

  useEffect(() => {
    api.get('/admin/orders').then(({ data }) => {
      setOrders(data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const updateStatus = async (orderId, status, trackingNumber = '') => {
    setUpdating(orderId)
    try {
      const { data } = await api.put(`/admin/orders/${orderId}/status`, { status, trackingNumber })
      setOrders(prev => prev.map(o => o._id === orderId ? data.order : o))
      toast.success('Order status updated')
    } catch {
      toast.error('Failed to update')
    } finally {
      setUpdating(null)
    }
  }

  if (loading) return <div className="text-gray-500">Loading...</div>

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Orders</h1>
      <div className="space-y-4">
        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">No orders.</div>
        ) : (
          orders.map((order) => (
            <div key={order._id} className="bg-white rounded-lg shadow p-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="font-mono font-semibold">#{order.orderNumber}</p>
                  <p className="text-sm text-gray-500">{order.user?.name} · {order.user?.email}</p>
                  <p className="text-sm text-gray-500">{format(new Date(order.createdAt), 'PPp')}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.status}
                  </span>
                  <p className="font-semibold text-primary-600">₹{order.totalAmount?.toLocaleString()}</p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <select
                  value=""
                  onChange={(e) => {
                    const v = e.target.value
                    if (v) updateStatus(order._id, v)
                  }}
                  disabled={updating === order._id}
                  className="input-field w-40 text-sm"
                >
                  <option value="">Update status</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <input
                  type="text"
                  placeholder="Tracking number"
                  className="input-field w-40 text-sm"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const v = e.target.value.trim()
                      if (v) updateStatus(order._id, 'shipped', v)
                    }
                  }}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
