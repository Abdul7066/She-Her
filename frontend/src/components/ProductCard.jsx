import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../features/cartSlice';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const [isHovered, setIsHovered] = useState(false);

  const renderStars = (rating) => {
    return (
      <div className="product-rating" style={{ display: 'flex', alignItems: 'center', marginBottom: '0.8rem' }}>
         <span style={{ color: '#f8e825', fontSize: '16px' }}>★</span>
         <span style={{ marginLeft: '4px', fontWeight: '600', fontSize: '13px' }}>{rating ? rating.toFixed(1) : '5.0'}</span>
         <span style={{ marginLeft: '6px', color: 'var(--text-light)', fontSize: '12px' }}>({product.numReviews || 0} reviews)</span>
      </div>
    );
  };

  return (
    <div className="product-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
         onMouseEnter={() => setIsHovered(true)} 
         onMouseLeave={() => setIsHovered(false)}>
         
      <div className="product-img-wrapper" style={{ overflow: 'hidden', position: 'relative', height: '280px', flexShrink: 0 }}>
        <Link to={`/product/${product._id}`} style={{ display: 'block', height: '100%', width: '100%' }}>
           <img 
             src={product.imageUrl} 
             alt={product.name} 
             style={{ 
                transition: 'transform 0.5s ease-in-out', 
                height: '100%', 
                width: '100%', 
                objectFit: 'cover',
                /* Faking an alternate angle using a mirror flip and slight zoom on hover */
                transform: isHovered ? 'scaleX(-1) scale(1.05)' : 'scaleX(1) scale(1)'
             }}
           />
        </Link>
      </div>

      <div style={{ padding: '1.2rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
         <Link to={`/product/${product._id}`} style={{ textDecoration: 'none' }}>
           <h3 className="product-title" style={{ fontSize: '18px', marginBottom: '8px' }}>{product.name}</h3>
         </Link>
         
         {renderStars(product.rating)}

         <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <p className="product-price" style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>
               ${product.price ? product.price.toFixed(2) : '0.00'}
            </p>
            <span className="tag-pill" style={{ marginBottom: 0, padding: '4px 10px', fontSize: '11px' }}>
               {product.category || 'Luxury'}
            </span>
         </div>

         <p className="product-desc" style={{ color: 'var(--text-light)', fontSize: '13px', lineHeight: '1.4', marginBottom: '1.5rem', flexGrow: 1 }}>
            {product.description ? product.description.substring(0, 85) : ''}...
         </p>

         {/* Dense Detail Matrix - specifically spaced out to ensure visibility */}
         <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '1.5rem', background: 'rgba(0,0,0,0.02)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <span style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--text-light)' }}>Sizes:</span>
               <div style={{ display: 'flex', gap: '4px' }}>
                  {product.sizes && product.sizes.length > 0 ? product.sizes.map((s) => (
                     <span key={s} style={{ fontSize: '10px', padding: '2px 6px', border: '1px solid var(--deep-lavender)', color: 'var(--deep-lavender)', borderRadius: '4px', fontWeight: '600' }}>{s}</span>
                  )) : <span style={{ fontSize: '10px', color: '#999' }}>One Size</span>}
               </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <span style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--text-light)' }}>Colors:</span>
               <div style={{ display: 'flex', gap: '4px' }}>
                  {product.colors && product.colors.length > 0 ? product.colors.map((c) => (
                     <span key={c} style={{ fontSize: '10px', padding: '2px 6px', background: 'var(--deep-pink)', color: 'white', borderRadius: '4px', fontWeight: '600' }}>{c}</span>
                  )) : <span style={{ fontSize: '10px', color: '#999' }}>Standard</span>}
               </div>
            </div>
         </div>

         <button 
           onClick={() => dispatch(addToCart({ ...product, product: product._id, qty: 1 }))}
           className="btn-primary"
           style={{ width: '100%', padding: '10px' }}
           disabled={!product.inStock}>
           {product.inStock ? 'Add to Collection' : 'Sold Out'}
         </button>
      </div>
    </div>
  );
};

export default ProductCard;
