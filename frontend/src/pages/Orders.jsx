import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { fetchOrders } from '../store/slices/orderSlice'
import { format } from 'date-fns'

const Orders = () => {
  const dispatch = useDispatch()
  const { orders, loading } = useSelector((state) => state.orders)

  useEffect(() => {
    dispatch(fetchOrders())
  }, [dispatch])

  if (loading) {
    return <div className="container mx-auto px-4 py-12 text-center">Loading...</div>
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">No orders yet</h2>
        <Link to="/products" className="btn-primary">
          Start Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>
      
      <div className="space-y-4">
        {orders.map((order) => (
          <Link
            key={order._id}
            to={`/orders/${order._id}`}
            className="card hover:shadow-lg transition-shadow block"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">Order #{order.orderNumber}</h3>
                <p className="text-gray-600">
                  {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {order.items.length} item(s)
                </p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-primary-600">
                  ₹{order.totalAmount}
                </p>
                <span className={`inline-block px-3 py-1 rounded-full text-sm mt-2 ${
                  order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                  order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Orders
