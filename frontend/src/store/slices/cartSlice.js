import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  return {
    headers: { Authorization: `Bearer ${token}` }
  }
}

export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API_URL}/cart`, getAuthHeaders())
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch cart')
    }
  }
)

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, quantity = 1, size = '100ml' }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${API_URL}/cart`,
        { productId, quantity, size },
        getAuthHeaders()
      )
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add to cart')
    }
  }
)

export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ itemId, quantity }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(
        `${API_URL}/cart/${itemId}`,
        { quantity },
        getAuthHeaders()
      )
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update cart')
    }
  }
)

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (itemId, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(
        `${API_URL}/cart/${itemId}`,
        getAuthHeaders()
      )
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove from cart')
    }
  }
)

export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/cart`, getAuthHeaders())
      return { cart: { items: [] }, totals: { subtotal: 0, discount: 0, total: 0 } }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to clear cart')
    }
  }
)

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    totals: {
      subtotal: 0,
      discount: 0,
      total: 0,
    },
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.items = action.payload.cart.items || []
        state.totals = action.payload.totals || state.totals
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.items = action.payload.cart.items || []
        state.totals = action.payload.totals || state.totals
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.items = action.payload.cart.items || []
        state.totals = action.payload.totals || state.totals
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = action.payload.cart.items || []
        state.totals = action.payload.totals || state.totals
      })
      .addCase(clearCart.fulfilled, (state, action) => {
        state.items = []
        state.totals = action.payload.totals
      })
  },
})

export default cartSlice.reducer
