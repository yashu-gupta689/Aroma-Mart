import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  return {
    headers: { Authorization: `Bearer ${token}` }
  }
}

export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${API_URL}/orders`,
        orderData,
        getAuthHeaders()
      )
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create order')
    }
  }
)

export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API_URL}/orders`, getAuthHeaders())
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch orders')
    }
  }
)

export const fetchOrder = createAsyncThunk(
  'orders/fetchOrder',
  async (orderId, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        `${API_URL}/orders/${orderId}`,
        getAuthHeaders()
      )
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch order')
    }
  }
)

export const verifyPayment = createAsyncThunk(
  'orders/verifyPayment',
  async ({ orderId, paymentData }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${API_URL}/orders/${orderId}/verify-payment`,
        paymentData,
        getAuthHeaders()
      )
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Payment verification failed')
    }
  }
)

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    orders: [],
    currentOrder: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentOrder: (state) => {
      state.currentOrder = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false
        state.currentOrder = action.payload.order
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.orders = action.payload
      })
      .addCase(fetchOrder.fulfilled, (state, action) => {
        state.currentOrder = action.payload
      })
      .addCase(verifyPayment.fulfilled, (state, action) => {
        state.currentOrder = action.payload.order
      })
  },
})

export const { clearCurrentOrder } = orderSlice.actions
export default orderSlice.reducer
