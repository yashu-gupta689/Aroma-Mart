import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../../utils/axios'
import toast from 'react-hot-toast'

const categories = ['men', 'women', 'unisex', 'niche', 'designer']

export default function EditProduct() {
  const { productId } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
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
  const [newImages, setNewImages] = useState([])

  useEffect(() => {
    api.get(`/products/${productId}`).then(({ data }) => {
      const p = data.product
      setForm({
        name: p.name || '',
        brand: p.brand || '',
        description: p.description || '',
        category: p.category || 'unisex',
        price: p.price ?? '',
        discount: String(p.discount ?? 0),
        stock: p.stock ?? '',
        size: p.size || '100ml',
        longevity: String(p.longevity ?? 3),
        projection: String(p.projection ?? 3),
        fragranceNotes: {
          top: p.fragranceNotes?.top || '',
          middle: p.fragranceNotes?.middle || '',
          base: p.fragranceNotes?.base || '',
        },
      })
      setLoading(false)
    }).catch(() => {
      setLoading(false)
      toast.error('Product not found')
    })
  }, [productId])

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
    setNewImages(Array.from(e.target.files || []))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const formData = new FormData()
      Object.entries(form).forEach(([key, value]) => {
        if (key === 'fragranceNotes') {
          formData.append(key, JSON.stringify(value))
        } else if (value !== '' && value !== undefined) {
          formData.append(key, value)
        }
      })
      newImages.forEach((file) => formData.append('images', file))

      await api.put(`/seller/products/${productId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      toast.success('Product updated. Pending re-approval.')
      navigate('/seller/products')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="text-gray-500">Loading...</div>

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Product</h1>
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Fragrance Notes</label>
          <div className="space-y-2">
            <input placeholder="Top notes" name="notes.top" value={form.fragranceNotes.top} onChange={handleChange} className="input-field" />
            <input placeholder="Middle notes" name="notes.middle" value={form.fragranceNotes.middle} onChange={handleChange} className="input-field" />
            <input placeholder="Base notes" name="notes.base" value={form.fragranceNotes.base} onChange={handleChange} className="input-field" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">New images (optional, replaces existing)</label>
          <input type="file" accept="image/*" multiple onChange={handleImageChange} className="input-field" />
        </div>
        <div className="flex gap-4 pt-4">
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? 'Saving...' : 'Update Product'}
          </button>
          <button type="button" onClick={() => navigate('/seller/products')} className="btn-secondary">Cancel</button>
        </div>
      </form>
    </div>
  )
}
