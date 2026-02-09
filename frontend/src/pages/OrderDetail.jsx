import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchOrder } from '../store/slices/orderSlice'
import { format } from 'date-fns'

const OrderDetail = () => {
  const { orderId } = useParams()
  const dispatch = useDispatch()
  const { currentOrder, loading } = useSelector((state) => state.orders)

  useEffect(() => {
    dispatch(fetchOrder(orderId))
  }, [dispatch, orderId])

  if (loading || !currentOrder) {
    return <div className="container mx-auto px-4 py-12 text-center">Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Order Details</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="card">
            <h2 className="text-xl font-bold mb-4">Order Items</h2>
            <div className="space-y-4">
              {currentOrder.items.map((item, idx) => (
                <div key={idx} className="flex gap-4 pb-4 border-b last:border-0">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.brand}</h3>
                    <p className="text-gray-600">{item.name}</p>
                    <p className="text-sm text-gray-500">Size: {item.size}</p>
                    <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-bold">₹{item.price * item.quantity}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="card">
            <h2 className="text-xl font-bold mb-4">Shipping Address</h2>
            <p>{currentOrder.shippingAddress.name}</p>
            <p>{currentOrder.shippingAddress.addressLine1}</p>
            {currentOrder.shippingAddress.addressLine2 && (
              <p>{currentOrder.shippingAddress.addressLine2}</p>
            )}
            <p>
              {currentOrder.shippingAddress.city}, {currentOrder.shippingAddress.state} - {currentOrder.shippingAddress.pincode}
            </p>
            <p>{currentOrder.shippingAddress.country}</p>
            <p className="mt-2">Phone: {currentOrder.shippingAddress.phone}</p>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="card">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Order Number</span>
                <span className="font-mono">{currentOrder.orderNumber}</span>
              </div>
              <div className="flex justify-between">
                <span>Order Date</span>
                <span>{format(new Date(currentOrder.createdAt), 'MMM dd, yyyy')}</span>
              </div>
              <div className="flex justify-between">
                <span>Status</span>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  currentOrder.status === 'delivered' ? 'bg-green-100 text-green-800' :
                  currentOrder.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {currentOrder.status.charAt(0).toUpperCase() + currentOrder.status.slice(1)}
                </span>
              </div>
              {currentOrder.trackingNumber && (
                <div className="flex justify-between">
                  <span>Tracking Number</span>
                  <span className="font-mono">{currentOrder.trackingNumber}</span>
                </div>
              )}
              <div className="border-t pt-2 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{currentOrder.subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>₹{currentOrder.shipping}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>₹{currentOrder.tax}</span>
                </div>
                {currentOrder.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-₹{currentOrder.discount}</span>
                  </div>
                )}
                <div className="border-t pt-2 flex justify-between font-bold text-xl">
                  <span>Total</span>
                  <span>₹{currentOrder.totalAmount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderDetail
