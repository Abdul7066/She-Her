import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import CheckoutSteps from '../components/CheckoutSteps';

const PlaceOrderScreen = () => {
  const cart = useSelector((state) => state.cart);
  const userInfo = useSelector((state) => state.auth.userInfo);
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const itemsPrice = cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const taxPrice = 0.15 * itemsPrice;
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  useEffect(() => {
    if (!userInfo) navigate('/login');
  }, [userInfo, navigate]);

  const placeOrderHandler = async () => {
    try {
      const config = { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${userInfo.token}` } };
      const { data } = await axios.post('/api/orders', {
        orderItems: cart.cartItems,
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice, shippingPrice, taxPrice, totalPrice
      }, config);
      navigate(`/order/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <CheckoutSteps step1 step2 step3 step4 />
      <div className="cart-layout">
        <div className="cart-list glass-panel">
          <h2 className="auth-title" style={{ textAlign: 'left', margin: 0 }}>Order Finalization</h2>
          
          <h3 style={{ fontFamily: 'Playfair Display', marginTop: '2.5rem', marginBottom: '10px' }}>Dispatch Address</h3>
          <p style={{ color: 'var(--text-light)', lineHeight: '1.6' }}>{cart.shippingAddress.address}, {cart.shippingAddress.city} {cart.shippingAddress.postalCode}</p>
          
          <h3 style={{ fontFamily: 'Playfair Display', marginTop: '2.5rem', marginBottom: '10px' }}>Payment System</h3>
          <p style={{ color: 'var(--text-light)', lineHeight: '1.6' }}>{cart.paymentMethod}</p>
          
          <h3 style={{ fontFamily: 'Playfair Display', borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: '1rem', marginTop: '2.5rem' }}>Apparel Selections</h3>
          <div style={{ marginTop: '1.5rem' }}>
          {cart.cartItems.map((item, index) => (
             <div key={index} className="data-row">
               <span style={{ fontWeight: 500 }}>{item.name}</span>
               <span style={{ color: 'var(--deep-pink)', fontWeight: 'bold' }}>{item.qty} x ${item.price} = ${(item.qty * item.price).toFixed(2)}</span>
             </div>
          ))}
          </div>
        </div>
        
        <div className="cart-summary">
          <div className="glass-panel summary-card">
            <h3 style={{ color: 'var(--text-dark)', marginBottom: '1.5rem', fontFamily: 'Playfair Display' }}>Financial Summary</h3>
            <div className="data-row"><span>Apparel Costs:</span> <span style={{ fontWeight: '600' }}>${itemsPrice.toFixed(2)}</span></div>
            <div className="data-row"><span>Logistics Allocation:</span> <span style={{ fontWeight: '600' }}>${shippingPrice.toFixed(2)}</span></div>
            <div className="data-row"><span>Regional Tax:</span> <span style={{ fontWeight: '600' }}>${taxPrice.toFixed(2)}</span></div>
            
            <div className="data-row" style={{ borderTop: '2px solid var(--primary-pink)', marginTop: '1rem', paddingTop: '1.5rem' }}>
              <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Grand Total:</span>
              <span className="product-price" style={{ margin: 0, fontSize: '26px' }}>${totalPrice.toFixed(2)}</span>
            </div>
            
            {error && <div className="alert-box alert-danger" style={{ marginTop: '1.5rem' }}>{error}</div>}
            
            <button onClick={placeOrderHandler} disabled={cart.cartItems.length === 0} className="btn-primary" style={{ marginTop: '2rem', padding: '16px' }}>
              Authorize Execution
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PlaceOrderScreen;
