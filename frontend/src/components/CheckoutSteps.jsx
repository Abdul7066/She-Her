import React from 'react';
import { Link } from 'react-router-dom';

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
  return (
    <div className="glass-panel" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '3rem', padding: '1.5rem', borderRadius: '12px' }}>
      {step1 ? <Link to="/login" className="step-item active">Sign In</Link> : <span className="step-item">Sign In</span>}
      <span className="step-separator">●</span>
      {step2 ? <Link to="/shipping" className="step-item active">Shipping</Link> : <span className="step-item">Shipping</span>}
      <span className="step-separator">●</span>
      {step3 ? <Link to="/payment" className="step-item active">Payment</Link> : <span className="step-item">Payment</span>}
      <span className="step-separator">●</span>
      {step4 ? <Link to="/placeorder" className="step-item active">Place Order</Link> : <span className="step-item">Place Order</span>}
    </div>
  );
};
export default CheckoutSteps;
