import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../utils/axios'
import toast from 'react-hot-toast'

const categories = ['men', 'women', 'unisex', 'niche', 'designer']

export default function AddProduct() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '',
    brand: '',
    description: '',
    category: 'unisex',
    price: '',
    discount: '0',
    stock: '',
    size: '100ml',
    longevity: '3',
    projection: '3',
    fragranceNotes: { top: '', middle: '', base: '' },
  })
  const [images, setImages] = useState([])

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name.startsWith('notes.')) {
      const key = name.split('.')[1]
      setForm(prev => ({
        ...prev,
        fragranceNotes: { ...prev.fragranceNotes, [key]: value }
      }))
    } else {
      setForm(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || [])
    if (files.length + images.length > 5) {
      toast.error('Maximum 5 images allowed')
      return
    }
    setImages(prev => [...prev, ...files])
  }

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const formData = new FormData()
      Object.entries(form).forEach(([key, value]) => {
        if (key === 'fragranceNotes') {
          formData.append(key, JSON.stringify(value))
        } else if (value !== '' && value !== undefined) {
          formData.append(key, value)
        }
      })
      images.forEach((file) => formData.append('images', file))

      await api.post('/seller/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      toast.success('Product submitted for approval.')
      navigate('/seller/products')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add product')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Add Product</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 max-w-2xl space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
          <input name="name" value={form.name} onChange={handleChange} className="input-field" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Brand *</label>
          <input name="brand" value={form.brand} onChange={handleChange} className="input-field" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
          <select name="category" value={form.category} onChange={handleChange} className="input-field">
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
          <textarea name="description" value={form.description} onChange={handleChange} className="input-field" rows={3} required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹) *</label>
            <input type="number" name="price" value={form.price} onChange={handleChange} className="input-field" min="0" step="0.01" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
            <input type="number" name="discount" value={form.discount} onChange={handleChange} className="input-field" min="0" max="100" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stock *</label>
            <input type="number" name="stock" value={form.stock} onChange={handleChange} className="input-field" min="0" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Size</label>
            <select name="size" value={form.size} onChange={handleChange} className="input-field">
              {['30ml', '50ml', '100ml', '200ml', 'other'].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fragrance Notes *</label>
          <div className="space-y-2">
            <input placeholder="Top notes" name="notes.top" value={form.fragranceNotes.top} onChange={handleChange} className="input-field" />
            <input placeholder="Middle notes" name="notes.middle" value={form.fragranceNotes.middle} onChange={handleChange} className="input-field" />
            <input placeholder="Base notes" name="notes.base" value={form.fragranceNotes.base} onChange={handleChange} className="input-field" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Images (max 5) *</label>
          <input type="file" accept="image/*" multiple onChange={handleImageChange} className="input-field" />
          <div className="flex flex-wrap gap-2 mt-2">
            {images.map((file, i) => (
              <span key={i} className="text-sm bg-gray-100 px-2 py-1 rounded flex items-center gap-1">
                {file.name}
                <button type="button" onClick={() => removeImage(i)} className="text-red-500 hover:text-red-700">×</button>
              </span>
            ))}
          </div>
        </div>
        <div className="flex gap-4 pt-4">
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Submitting...' : 'Add Product'}
          </button>
          <button type="button" onClick={() => navigate('/seller/products')} className="btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
