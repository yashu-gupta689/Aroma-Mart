import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchCart } from '../store/slices/cartSlice'
import { createOrder, verifyPayment } from '../store/slices/orderSlice'
import toast from 'react-hot-toast'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Load Razorpay script
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(window.Razorpay)
    script.onerror = () => resolve(null)
    document.body.appendChild(script)
  })
}

const Checkout = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { items, totals } = useSelector((state) => state.cart)
  const { user } = useSelector((state) => state.auth)
  const { currentOrder } = useSelector((state) => state.orders)

  const [shippingAddress, setShippingAddress] = useState({
    name: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
  })
  const [paymentMethod, setPaymentMethod] = useState('razorpay')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    dispatch(fetchCart())
    if (user?.addresses?.length > 0) {
      const defaultAddress = user.addresses.find(addr => addr.isDefault) || user.addresses[0]
      setShippingAddress({
        name: defaultAddress.name || '',
        phone: defaultAddress.phone || '',
        addressLine1: defaultAddress.addressLine1 || '',
        addressLine2: defaultAddress.addressLine2 || '',
        city: defaultAddress.city || '',
        state: defaultAddress.state || '',
        pincode: defaultAddress.pincode || '',
        country: defaultAddress.country || 'India',
      })
    }
  }, [dispatch, user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const orderData = {
        shippingAddress,
        paymentMethod,
      }

      const result = await dispatch(createOrder(orderData)).unwrap()

      if (paymentMethod === 'razorpay' && result.razorpayOrder) {
        if (!razorpayLoaded) {
          toast.error('Payment gateway is loading. Please try again.')
          return
        }

        // Initialize Razorpay
        const Razorpay = window.Razorpay
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: result.razorpayOrder.amount,
          currency: 'INR',
          name: 'AromaMart',
          description: `Order ${result.order.orderNumber}`,
          order_id: result.razorpayOrder.id,
          handler: async (response) => {
            try {
              await dispatch(verifyPayment({
                orderId: result.order._id,
                paymentData: {
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                }
              })).unwrap()

              toast.success('Payment successful!')
              navigate(`/orders/${result.order._id}`)
            } catch (error) {
              toast.error(error || 'Payment verification failed')
            }
          },
          prefill: {
            name: user?.name || '',
            email: user?.email || '',
            contact: shippingAddress.phone || '',
          },
          theme: {
            color: '#ec4899',
          },
        }

        const razorpay = new Razorpay(options)
        razorpay.open()
      } else {
        navigate(`/orders/${result.order._id}`)
      }
    } catch (error) {
      toast.error(error || 'Failed to create order')
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <a href="/products" className="btn-primary">
          Continue Shopping
        </a>
      </div>
    )
  }

  const totalAmount = totals.total + (totals.subtotal > 500 ? 0 : 50)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping Address */}
          <div className="card">
            <h2 className="text-xl font-bold mb-4">Shipping Address</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Full Name"
                value={shippingAddress.name}
                onChange={(e) => setShippingAddress({ ...shippingAddress, name: e.target.value })}
                className="input-field"
                required
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={shippingAddress.phone}
                onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                className="input-field"
                required
              />
              <input
                type="text"
                placeholder="Address Line 1"
                value={shippingAddress.addressLine1}
                onChange={(e) => setShippingAddress({ ...shippingAddress, addressLine1: e.target.value })}
                className="input-field md:col-span-2"
                required
              />
              <input
                type="text"
                placeholder="Address Line 2"
                value={shippingAddress.addressLine2}
                onChange={(e) => setShippingAddress({ ...shippingAddress, addressLine2: e.target.value })}
                className="input-field md:col-span-2"
              />
              <input
                type="text"
                placeholder="City"
                value={shippingAddress.city}
                onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                className="input-field"
                required
              />
              <input
                type="text"
                placeholder="State"
                value={shippingAddress.state}
                onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
                className="input-field"
                required
              />
              <input
                type="text"
                placeholder="Pincode"
                value={shippingAddress.pincode}
                onChange={(e) => setShippingAddress({ ...shippingAddress, pincode: e.target.value })}
                className="input-field"
                required
              />
              <input
                type="text"
                placeholder="Country"
                value={shippingAddress.country}
                onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                className="input-field"
                required
              />
            </div>
          </div>

          {/* Payment Method */}
          <div className="card">
            <h2 className="text-xl font-bold mb-4">Payment Method</h2>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  value="razorpay"
                  checked={paymentMethod === 'razorpay'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span>Razorpay (Credit/Debit Card, UPI, Netbanking)</span>
              </label>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="card sticky top-20">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{totals.subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{totals.subtotal > 500 ? 'Free' : '₹50'}</span>
              </div>
              {totals.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-₹{totals.discount}</span>
                </div>
              )}
              <div className="border-t pt-2 flex justify-between font-bold text-xl">
                <span>Total</span>
                <span>₹{totalAmount}</span>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? 'Processing...' : `Pay ₹${totalAmount}`}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default Checkout
