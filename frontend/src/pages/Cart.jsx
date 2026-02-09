import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { fetchCart, updateCartItem, removeFromCart } from '../store/slices/cartSlice'
import { FiTrash2, FiPlus, FiMinus } from 'react-icons/fi'
import toast from 'react-hot-toast'

const Cart = () => {
  const dispatch = useDispatch()
  const { items, totals, loading } = useSelector((state) => state.cart)

  useEffect(() => {
    dispatch(fetchCart())
  }, [dispatch])

  const handleUpdateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return
    dispatch(updateCartItem({ itemId, quantity: newQuantity }))
  }

  const handleRemove = (itemId) => {
    dispatch(removeFromCart(itemId))
    toast.success('Item removed from cart')
  }

  if (loading) {
    return <div className="container mx-auto px-4 py-12 text-center">Loading...</div>
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <Link to="/products" className="btn-primary">
          Continue Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="card space-y-4">
            {items.map((item) => (
              <div key={item._id} className="flex gap-4 pb-4 border-b last:border-0">
                <img
                  src={item.product?.images[0]}
                  alt={item.product?.name}
                  className="w-24 h-24 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-semibold">{item.product?.brand}</h3>
                  <p className="text-gray-600">{item.product?.name}</p>
                  <p className="text-sm text-gray-500">Size: {item.size}</p>
                  <p className="text-lg font-bold text-primary-600 mt-2">
                    ₹{(item.product?.discountedPrice || item.product?.price) * item.quantity}
                  </p>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <button
                    onClick={() => handleRemove(item._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FiTrash2 />
                  </button>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                      className="p-1 border rounded"
                    >
                      <FiMinus />
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                      className="p-1 border rounded"
                    >
                      <FiPlus />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

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
                <span>₹{totals.total + (totals.subtotal > 500 ? 0 : 50)}</span>
              </div>
            </div>
            <Link to="/checkout" className="btn-primary w-full text-center block">
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
