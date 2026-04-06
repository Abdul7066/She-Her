import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

// ─── Constants ────────────────────────────────────────────────────────────────
const EMPTY_FORM = {
  name: '',
  description: '',
  price: '',
  category: 'Bridal Dresses',
  sizes: '',
  colors: '',
  inStock: true,
};

const CATEGORIES = [
  'Bridal Dresses',
  'Salwar Suits',
  'Pakistani Dresses',
  'Indian Daily Wear',
  'Hand Bags',
  'Purses',
  'Luxury Bags',
  'Indo Western'
];

// ─── Toast ────────────────────────────────────────────────────────────────────
const Toast = ({ toasts }) => (
  <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', zIndex: 9999 }}>
    {toasts.map(t => (
      <div key={t.id} style={{
        background: t.type === 'success' ? 'linear-gradient(135deg,#2e7d56,#43a87a)' : t.type === 'error' ? 'linear-gradient(135deg,#b52f4a,#e05a72)' : 'linear-gradient(135deg,#4a5ab5,#7283e0)',
        color: '#fff', padding: '0.9rem 1.4rem', borderRadius: '12px', fontSize: '14px', fontWeight: 500,
        boxShadow: '0 8px 24px rgba(0,0,0,0.18)', display: 'flex', alignItems: 'center', gap: '0.6rem',
        animation: 'slideInRight 0.35s ease', maxWidth: '340px',
      }}>
        <span style={{ fontSize: '18px' }}>{t.type === 'success' ? '✓' : t.type === 'error' ? '✗' : 'ℹ'}</span>
        {t.message}
      </div>
    ))}
  </div>
);

// ─── Confirm Modal ────────────────────────────────────────────────────────────
const ConfirmModal = ({ product, onConfirm, onCancel }) => (
  <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100 }}>
    <div className="glass-panel" style={{ maxWidth: '420px', width: '90%', textAlign: 'center', padding: '2.5rem', animation: 'popIn 0.3s ease' }}>
      <div style={{ fontSize: '48px', marginBottom: '1rem' }}>🗑️</div>
      <h3 style={{ fontSize: '22px', marginBottom: '0.75rem', color: 'var(--text-dark)' }}>Delete Product?</h3>
      <p style={{ color: 'var(--text-light)', marginBottom: '2rem', lineHeight: 1.6 }}>
        You are about to permanently remove <strong style={{ color: 'var(--deep-pink)' }}>"{product.name}"</strong>. This action cannot be undone.
      </p>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <button onClick={onCancel} style={{ flex: 1, padding: '12px', borderRadius: '30px', border: '1px solid rgba(0,0,0,0.15)', background: 'transparent', cursor: 'pointer', fontFamily: 'Inter,sans-serif', fontWeight: 600, fontSize: '13px', letterSpacing: '1px', color: 'var(--text-dark)', textTransform: 'uppercase', transition: 'all 0.25s' }}>Cancel</button>
        <button onClick={onConfirm} className="btn-primary" style={{ flex: 1, background: 'linear-gradient(135deg,#b52f4a,#e05a72)', boxShadow: '0 4px 15px rgba(181,47,74,0.35)' }}>Delete</button>
      </div>
    </div>
  </div>
);

// ─── Image Upload Field ───────────────────────────────────────────────────────
const ImageUploadField = ({ label, fieldName, existingUrl, file, onFileChange, required, error }) => {
  const inputRef = useRef();
  const preview = file ? URL.createObjectURL(file) : existingUrl;

  return (
    <div style={{ marginBottom: '1.25rem' }}>
      <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-light)', marginBottom: '6px' }}>
        {label} {required && '*'}
      </label>
      <div
        onClick={() => inputRef.current.click()}
        style={{
          border: `2px dashed ${error ? '#e05a72' : preview ? 'var(--primary-lavender)' : 'rgba(0,0,0,0.12)'}`,
          borderRadius: '12px', padding: preview ? '0' : '1.5rem',
          cursor: 'pointer', transition: 'all 0.25s', overflow: 'hidden',
          background: preview ? 'transparent' : 'rgba(188,160,220,0.04)',
          minHeight: preview ? 'auto' : '100px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column',
          position: 'relative',
        }}
      >
        {preview ? (
          <>
            <img src={preview} alt="preview" style={{ width: '100%', maxHeight: '180px', objectFit: 'cover', display: 'block' }} />
            <div style={{
              position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              opacity: 0, transition: 'opacity 0.2s', borderRadius: '10px',
            }}
              onMouseEnter={e => e.currentTarget.style.opacity = 1}
              onMouseLeave={e => e.currentTarget.style.opacity = 0}
            >
              <span style={{ color: '#fff', fontSize: '13px', fontWeight: 600 }}>📷 Change Image</span>
            </div>
          </>
        ) : (
          <>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>📸</div>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-light)', textAlign: 'center' }}>
              Click to upload<br /><span style={{ fontSize: '11px' }}>JPG, PNG, WEBP · max 5MB</span>
            </p>
          </>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        style={{ display: 'none' }}
        onChange={e => onFileChange(fieldName, e.target.files[0] || null)}
      />
      {error && <p style={{ fontSize: '12px', color: '#e05a72', marginTop: '4px' }}>{error}</p>}
    </div>
  );
};

// ─── Product Form Modal ───────────────────────────────────────────────────────
const ProductFormModal = ({ initial, onSave, onClose, saving }) => {
  const [form, setForm] = useState(initial ? {
    name: initial.name || '',
    description: initial.description || '',
    price: initial.price || '',
    category: initial.category || 'ladies-wear',
    sizes: Array.isArray(initial.sizes) ? initial.sizes.join(', ') : (initial.sizes || ''),
    colors: Array.isArray(initial.colors) ? initial.colors.join(', ') : (initial.colors || ''),
    inStock: initial.inStock ?? true,
  } : EMPTY_FORM);

  const [files, setFiles] = useState({ image: null, hoverImage: null });
  const [errors, setErrors] = useState({});
  const isEdit = !!initial?._id;

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));
  const setFile = (fieldName, file) => setFiles(f => ({ ...f, [fieldName]: file }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.description.trim()) e.description = 'Description is required';
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0) e.price = 'Enter a valid price';
    if (!isEdit && !files.image) e.image = 'Product image is required';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    const fd = new FormData();
    fd.append('name', form.name);
    fd.append('description', form.description);
    fd.append('price', form.price);
    fd.append('category', form.category);
    fd.append('inStock', form.inStock);
    fd.append('sizes', JSON.stringify(form.sizes.split(',').map(s => s.trim()).filter(Boolean)));
    fd.append('colors', JSON.stringify(form.colors.split(',').map(s => s.trim()).filter(Boolean)));
    if (files.image) fd.append('image', files.image);
    if (files.hoverImage) fd.append('hoverImage', files.hoverImage);

    onSave(fd);
  };

  const inputStyle = (field) => ({
    width: '100%', padding: '12px 14px', borderRadius: '10px',
    border: `1.5px solid ${errors[field] ? '#e05a72' : 'rgba(0,0,0,0.1)'}`,
    background: 'rgba(255,255,255,0.9)', fontFamily: 'Inter,sans-serif',
    fontSize: '14px', boxSizing: 'border-box', transition: 'all 0.25s', outline: 'none',
  });

  const labelStyle = { display: 'block', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-light)', marginBottom: '6px' };
  const errStyle = { fontSize: '12px', color: '#e05a72', marginTop: '4px' };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, padding: '1rem' }}>
      <div style={{ background: 'rgba(255,255,255,0.97)', backdropFilter: 'blur(20px)', borderRadius: '20px', padding: '2.5rem', width: '100%', maxWidth: '620px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 24px 60px rgba(0,0,0,0.15)', animation: 'popIn 0.3s ease' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
          <div>
            <h2 style={{ fontSize: '26px', color: 'var(--text-dark)', marginBottom: '4px' }}>
              {isEdit ? 'Edit Product' : 'Add New Product'}
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--text-light)', margin: 0 }}>
              {isEdit ? 'Update product info. Upload new image to replace.' : 'Fill details and upload a product image.'}
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '28px', cursor: 'pointer', color: 'var(--text-light)', lineHeight: 1 }}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Image Uploads side by side */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '0.5rem' }}>
            <ImageUploadField
              label="Main Image"
              fieldName="image"
              existingUrl={isEdit ? initial.imageUrl : null}
              file={files.image}
              onFileChange={setFile}
              required={!isEdit}
              error={errors.image}
            />
            <ImageUploadField
              label="Hover Image"
              fieldName="hoverImage"
              existingUrl={isEdit ? initial.hoverImageUrl : null}
              file={files.hoverImage}
              onFileChange={setFile}
              required={false}
            />
          </div>

          {/* Name */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={labelStyle}>Product Name *</label>
            <input id="prod-name" style={inputStyle('name')} value={form.name} onChange={e => { set('name', e.target.value); setErrors(r => ({ ...r, name: '' })); }} placeholder="e.g. Floral Silk Dress" />
            {errors.name && <p style={errStyle}>{errors.name}</p>}
          </div>

          {/* Description */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={labelStyle}>Description *</label>
            <textarea id="prod-desc" style={{ ...inputStyle('description'), minHeight: '80px', resize: 'vertical' }} value={form.description} onChange={e => { set('description', e.target.value); setErrors(r => ({ ...r, description: '' })); }} placeholder="Describe the product..." />
            {errors.description && <p style={errStyle}>{errors.description}</p>}
          </div>

          {/* Price + Category */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <label style={labelStyle}>Price (₹) *</label>
              <input id="prod-price" type="number" min="1" style={inputStyle('price')} value={form.price} onChange={e => { set('price', e.target.value); setErrors(r => ({ ...r, price: '' })); }} placeholder="1299" />
              {errors.price && <p style={errStyle}>{errors.price}</p>}
            </div>
            <div>
              <label style={labelStyle}>Category</label>
              <select id="prod-category" style={{ ...inputStyle(), background: 'rgba(255,255,255,0.9)' }} value={form.category} onChange={e => set('category', e.target.value)}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Sizes + Colors */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <label style={labelStyle}>Sizes <span style={{ textTransform: 'none', fontWeight: 400 }}>(comma-sep)</span></label>
              <input id="prod-sizes" style={inputStyle()} value={form.sizes} onChange={e => set('sizes', e.target.value)} placeholder="S, M, L, XL" />
            </div>
            <div>
              <label style={labelStyle}>Colors <span style={{ textTransform: 'none', fontWeight: 400 }}>(comma-sep)</span></label>
              <input id="prod-colors" style={inputStyle()} value={form.colors} onChange={e => set('colors', e.target.value)} placeholder="Red, White, Beige" />
            </div>
          </div>

          {/* In Stock toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem', padding: '1rem 1.25rem', background: 'rgba(188,160,220,0.08)', borderRadius: '10px', border: '1px solid rgba(188,160,220,0.2)' }}>
            <div id="prod-instock-toggle" onClick={() => set('inStock', !form.inStock)} style={{ width: '44px', height: '24px', borderRadius: '12px', background: form.inStock ? 'linear-gradient(135deg,var(--deep-pink),var(--primary-lavender))' : 'rgba(0,0,0,0.15)', cursor: 'pointer', position: 'relative', transition: 'background 0.3s', flexShrink: 0 }}>
              <div style={{ position: 'absolute', top: '3px', left: form.inStock ? '23px' : '3px', width: '18px', height: '18px', background: '#fff', borderRadius: '50%', transition: 'left 0.3s', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }} />
            </div>
            <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-dark)' }}>
              {form.inStock ? '✅ In Stock' : '❌ Out of Stock'}
            </span>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button type="button" onClick={onClose} style={{ flex: 1, padding: '13px', borderRadius: '30px', border: '1.5px solid rgba(0,0,0,0.12)', background: 'transparent', cursor: 'pointer', fontFamily: 'Inter,sans-serif', fontWeight: 600, fontSize: '13px', letterSpacing: '1px', color: 'var(--text-dark)', textTransform: 'uppercase', transition: 'all 0.25s' }}>Cancel</button>
            <button type="submit" id="prod-submit-btn" className="btn-primary" style={{ flex: 2 }} disabled={saving}>
              {saving ? 'Saving…' : isEdit ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Main Screen ──────────────────────────────────────────────────────────────
const AdminProductsScreen = () => {
  const { userInfo } = useSelector(s => s.auth);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [statsLoading, setStatsLoading] = useState(true);

  const authHeader = { Authorization: `Bearer ${userInfo?.token}` };

  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts(t => [...t, { id, message, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 4000);
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/api/products');
      setProducts(data.products ?? data);
    } catch {
      addToast('Failed to load products', 'error');
    } finally {
      setLoading(false);
      setStatsLoading(false);
    }
  }, [addToast]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  // Create / Update — send as FormData (multipart)
  // NOTE: Do NOT set Content-Type manually — Axios auto-sets it with the correct multipart boundary
  const handleSave = async (formData) => {
    setSaving(true);
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo?.token}` } };
      if (editProduct) {
        await axios.put(`/api/products/${editProduct._id}`, formData, config);
        addToast('Product updated!', 'success');
      } else {
        await axios.post('/api/products', formData, config);
        addToast('Product created!', 'success');
      }
      setModalOpen(false);
      setEditProduct(null);
      fetchProducts();
    } catch (err) {
      addToast(err.response?.data?.message || 'Save failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/products/${deleteTarget._id}`, { headers: authHeader });
      addToast('Product deleted', 'success');
      setDeleteTarget(null);
      fetchProducts();
    } catch (err) {
      addToast(err.response?.data?.message || 'Delete failed', 'error');
      setDeleteTarget(null);
    }
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase())
  );

  const totalValue = products.reduce((acc, p) => acc + (p.price || 0), 0);
  const inStockCount = products.filter(p => p.inStock).length;
  const categories = [...new Set(products.map(p => p.category))].length;

  return (
    <>
      <style>{`
        @keyframes slideInRight { from{opacity:0;transform:translateX(40px)} to{opacity:1;transform:translateX(0)} }
        @keyframes popIn { from{opacity:0;transform:scale(0.9)} to{opacity:1;transform:scale(1)} }
        @keyframes shimmer { 0%{background-position:-400px 0} 100%{background-position:400px 0} }
        .admin-row:hover { background: rgba(188,160,220,0.06) !important; }
        .action-btn { opacity:0.6; transition:opacity 0.2s,transform 0.2s; }
        .action-btn:hover { opacity:1; transform:scale(1.15); }
        .stat-card { transition:transform 0.3s,box-shadow 0.3s; }
        .stat-card:hover { transform:translateY(-4px); box-shadow:0 16px 40px rgba(188,160,220,0.25); }
        .search-input:focus { border-color:var(--primary-pink) !important; box-shadow:0 0 0 3px rgba(224,148,171,0.2) !important; }
      `}</style>

      <div style={{ padding: '0 0 4rem' }}>
        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg,#2c2a30 0%,#4a3060 60%,#8a5c7a 100%)', padding: '3rem 3rem 2.5rem', position: 'relative', overflow: 'hidden' }}>
          {['-80px', '60%'].map((left, i) => (
            <div key={i} style={{ position: 'absolute', borderRadius: '50%', width: i === 0 ? '300px' : '200px', height: i === 0 ? '300px' : '200px', top: i === 0 ? '-100px' : '40px', left, background: 'rgba(255,255,255,0.03)', pointerEvents: 'none' }} />
          ))}
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Atelier Command Center</p>
          <h1 style={{ fontFamily: 'Playfair Display,serif', color: '#fff', fontSize: '36px', margin: 0, marginBottom: '0.5rem' }}>Product Catalog Management</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '15px', margin: 0 }}>
            Signed in as <strong style={{ color: 'var(--primary-pink)' }}>{userInfo?.name}</strong>
            &nbsp;·&nbsp;
            <span style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 10px', borderRadius: '20px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', color: 'rgba(255,255,255,0.7)' }}>{userInfo?.role}</span>
          </p>
        </div>

        <div style={{ padding: '2.5rem 3rem' }}>
          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
            {[
              { label: 'Total Products', value: products.length, icon: '📦', color: 'var(--deep-lavender)' },
              { label: 'In Stock', value: inStockCount, icon: '✅', color: '#2e7d56' },
              { label: 'Out of Stock', value: products.length - inStockCount, icon: '⚠️', color: '#b5622f' },
              { label: 'Categories', value: categories, icon: '🏷️', color: 'var(--deep-pink)' },
              { label: 'Catalog Value', value: `₹${totalValue.toLocaleString('en-IN')}`, icon: '💰', color: '#4a5ab5' },
            ].map((stat, i) => (
              <div key={i} className="glass-panel stat-card" style={{ padding: '1.5rem', borderRadius: '16px' }}>
                <div style={{ fontSize: '28px', marginBottom: '0.5rem' }}>{stat.icon}</div>
                {statsLoading
                  ? <div style={{ height: '28px', width: '60px', borderRadius: '6px', background: 'linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%)', backgroundSize: '400px 100%', animation: 'shimmer 1.2s infinite' }} />
                  : <div style={{ fontSize: '22px', fontWeight: 700, fontFamily: 'Playfair Display,serif', color: stat.color }}>{stat.value}</div>
                }
                <div style={{ fontSize: '12px', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '2px' }}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Toolbar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ position: 'relative', flex: '1 1 280px', maxWidth: '400px' }}>
              <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', fontSize: '16px', color: 'var(--text-light)', pointerEvents: 'none' }}>🔍</span>
              <input className="search-input" id="product-search" placeholder="Search by name or category…" value={search} onChange={e => setSearch(e.target.value)} style={{ width: '100%', padding: '12px 14px 12px 42px', borderRadius: '30px', border: '1.5px solid rgba(0,0,0,0.1)', background: 'rgba(255,255,255,0.9)', fontFamily: 'Inter,sans-serif', fontSize: '14px', boxSizing: 'border-box', transition: 'all 0.25s', outline: 'none' }} />
              {search && <button onClick={() => setSearch('')} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: 'var(--text-light)' }}>×</button>}
            </div>
            <button id="add-product-btn" onClick={() => { setEditProduct(null); setModalOpen(true); }} className="btn-primary" style={{ width: 'auto', padding: '12px 28px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '18px', lineHeight: 1 }}>+</span> Add Product
            </button>
          </div>

          {/* Table */}
          <div style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(16px)', borderRadius: '20px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.6)', boxShadow: '0 8px 32px rgba(188,160,220,0.1)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '60px 2fr 1fr 1fr 1fr 80px 120px', padding: '1rem 1.5rem', background: 'linear-gradient(135deg,rgba(44,42,48,0.05),rgba(74,48,96,0.05))', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
              {['#', 'Product', 'Category', 'Price', 'Stock', 'Rating', 'Actions'].map(h => (
                <div key={h} style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--text-light)' }}>{h}</div>
              ))}
            </div>

            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '60px 2fr 1fr 1fr 1fr 80px 120px', padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                  {[40, 130, 80, 60, 60, 50, 90].map((w, j) => (
                    <div key={j} style={{ height: '16px', width: `${w}px`, borderRadius: '6px', background: 'linear-gradient(90deg,#f0f0f0 25%,#e8e8e8 50%,#f0f0f0 75%)', backgroundSize: '400px 100%', animation: 'shimmer 1.2s infinite' }} />
                  ))}
                </div>
              ))
            ) : filtered.length === 0 ? (
              <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-light)' }}>
                <div style={{ fontSize: '48px', marginBottom: '1rem' }}>📭</div>
                <p style={{ fontSize: '16px', margin: 0 }}>{search ? `No products matching "${search}"` : 'No products yet. Add your first one!'}</p>
              </div>
            ) : (
              filtered.map((p, idx) => (
                <div key={p._id} className="admin-row" style={{ display: 'grid', gridTemplateColumns: '60px 2fr 1fr 1fr 1fr 80px 120px', padding: '1.1rem 1.5rem', borderBottom: '1px solid rgba(0,0,0,0.04)', alignItems: 'center', transition: 'background 0.2s', background: 'transparent' }}>
                  <div style={{ fontSize: '13px', color: 'var(--text-light)', fontWeight: 500 }}>{idx + 1}</div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0, background: 'var(--bg-ethereal)', border: '1px solid rgba(0,0,0,0.07)' }}>
                      {p.imageUrl
                        ? <img src={p.imageUrl} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.style.display = 'none'; }} />
                        : <span style={{ fontSize: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>👗</span>
                      }
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-dark)' }}>{p.name}</div>
                      {p.sizes?.length > 0 && <div style={{ fontSize: '11px', color: 'var(--text-light)' }}>{p.sizes.join(' · ')}</div>}
                    </div>
                  </div>

                  <div><span style={{ fontSize: '11px', background: 'rgba(188,160,220,0.12)', padding: '4px 10px', borderRadius: '20px', color: 'var(--deep-lavender)', fontWeight: 600, textTransform: 'capitalize' }}>{p.category}</span></div>
                  <div style={{ fontSize: '15px', fontFamily: 'Playfair Display,serif', color: 'var(--deep-lavender)', fontWeight: 600 }}>₹{p.price?.toLocaleString('en-IN')}</div>
                  <div><span style={{ fontSize: '11px', padding: '4px 10px', borderRadius: '20px', fontWeight: 600, background: p.inStock ? 'rgba(46,125,86,0.12)' : 'rgba(181,47,74,0.12)', color: p.inStock ? '#2e7d56' : '#b52f4a' }}>{p.inStock ? '● In Stock' : '● Out of Stock'}</span></div>
                  <div style={{ fontSize: '13px', color: 'var(--text-light)' }}>⭐ {p.rating?.toFixed(1)} <span style={{ fontSize: '11px' }}>({p.numReviews})</span></div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button id={`edit-${p._id}`} className="action-btn" title="Edit" onClick={() => { setEditProduct(p); setModalOpen(true); }} style={{ background: 'rgba(74,90,181,0.1)', border: 'none', borderRadius: '8px', width: '34px', height: '34px', cursor: 'pointer', fontSize: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✏️</button>
                    <button id={`delete-${p._id}`} className="action-btn" title="Delete" onClick={() => setDeleteTarget(p)} style={{ background: 'rgba(181,47,74,0.1)', border: 'none', borderRadius: '8px', width: '34px', height: '34px', cursor: 'pointer', fontSize: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🗑️</button>
                  </div>
                </div>
              ))
            )}

            {!loading && filtered.length > 0 && (
              <div style={{ padding: '0.9rem 1.5rem', borderTop: '1px solid rgba(0,0,0,0.05)', fontSize: '13px', color: 'var(--text-light)', display: 'flex', justifyContent: 'space-between' }}>
                <span>Showing <strong>{filtered.length}</strong> of <strong>{products.length}</strong> products</span>
                {search && <span>Filtered by: "<em>{search}</em>"</span>}
              </div>
            )}
          </div>
        </div>
      </div>

      {modalOpen && (
        <ProductFormModal
          initial={editProduct}
          onSave={handleSave}
          onClose={() => { setModalOpen(false); setEditProduct(null); }}
          saving={saving}
        />
      )}
      {deleteTarget && (
        <ConfirmModal product={deleteTarget} onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
      )}
      <Toast toasts={toasts} />
    </>
  );
};

export default AdminProductsScreen;
