import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart } from '../features/cartSlice';
import { Link, useNavigate } from 'react-router-dom';

const CartScreen = () => {
  const cartItems = useSelector(state => state.cart.cartItems);
  const userInfo = useSelector(state => state.auth.userInfo);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <div className="cart-layout">
      <div className="cart-list">
        <h2 className="page-header">Shopping Bag</h2>
        {cartItems.length === 0 ? (
          <div className="alert-box alert-info">Your cart is empty. <Link to="/" style={{ color: 'inherit', fontWeight: 'bold' }}>Curate your collection</Link></div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '2rem' }}>
            {cartItems.map(item => (
              <div key={item.product} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 className="product-title" style={{ margin: 0 }}>{item.name}</h3>
                <p className="product-price" style={{ margin: 0 }}>${item.price}</p>
                <button onClick={() => dispatch(removeFromCart(item.product))} className="btn-secondary" style={{ background: 'transparent', padding: '6px 14px', border: '1px solid var(--deep-pink)', color: 'var(--deep-pink)', borderRadius: '20px', cursor: 'pointer', fontSize: '12px' }}>Remove</button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="cart-summary">
        <div className="glass-panel summary-card">
          <h3 style={{ color: 'var(--text-dark)', marginBottom: '1.5rem', fontFamily: 'Playfair Display' }}>Order Summary</h3>
          <div className="data-row">
            <span>Items count:</span>
            <span style={{ fontWeight: '600' }}>{cartItems.reduce((acc, item) => acc + item.qty, 0)}</span>
          </div>
          <div className="data-row">
            <span style={{ fontSize: '18px', fontWeight: '600' }}>Subtotal:</span>
            <span className="product-price" style={{ margin: 0, fontSize: '24px' }}>${cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2)}</span>
          </div>
          <button 
            className="btn-primary" 
            style={{ marginTop: '2rem', opacity: (cartItems.length === 0 || !userInfo) ? 0.5 : 1 }}
            disabled={cartItems.length === 0 || !userInfo}
            onClick={() => navigate('/shipping')}
          >
            {userInfo ? "Proceed to Checkout" : "Sign in to Checkout"}
          </button>
        </div>
      </div>
    </div>
  );
};
export default CartScreen;
