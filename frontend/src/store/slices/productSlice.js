import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams(filters).toString()
      const { data } = await axios.get(`${API_URL}/products?${params}`)
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch products')
    }
  }
)

export const fetchProduct = createAsyncThunk(
  'products/fetchProduct',
  async (productId, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API_URL}/products/${productId}`)
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch product')
    }
  }
)

const productSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    product: null,
    similarProducts: [],
    pagination: {},
    loading: false,
    error: null,
  },
  reducers: {
    clearProduct: (state) => {
      state.product = null
      state.similarProducts = []
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false
        state.products = action.payload.products
        state.pagination = action.payload.pagination
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(fetchProduct.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.loading = false
        state.product = action.payload.product
        state.similarProducts = action.payload.similarProducts
      })
      .addCase(fetchProduct.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearProduct } = productSlice.actions
export default productSlice.reducer
