import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { savePaymentMethod } from '../features/cartSlice';
import CheckoutSteps from '../components/CheckoutSteps';

const PaymentScreen = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;
  const navigate = useNavigate();
  if (!shippingAddress.address) {
    navigate('/shipping');
  }

  const [paymentMethod, setPaymentMethod] = useState('Stripe');
  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate('/placeorder');
  };

  return (
    <div className="form-container">
      <CheckoutSteps step1 step2 step3 />
      <div className="glass-panel">
        <h2 className="auth-title">Payment Gateway</h2>
        <form onSubmit={submitHandler}>
          <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '1.5rem', background: 'rgba(255,255,255,0.7)', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)' }}>
            <input type="radio" value="Stripe" checked={paymentMethod === 'Stripe'} onChange={(e) => setPaymentMethod(e.target.value)} style={{ width: '20px', height: '20px', accentColor: 'var(--deep-pink)' }} />
            <span style={{ fontWeight: '500', color: 'var(--text-dark)', fontSize: '16px' }}>Stripe (Encrypted Architecture)</span>
          </div>
          <button type="submit" className="btn-primary" style={{ marginTop: '1.5rem' }}>Review Order Context</button>
        </form>
      </div>
    </div>
  );
};
export default PaymentScreen;
