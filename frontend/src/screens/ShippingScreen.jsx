import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { saveShippingAddress } from '../features/cartSlice';
import CheckoutSteps from '../components/CheckoutSteps';

const ShippingScreen = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;
  
  const [address, setAddress] = useState(shippingAddress.address || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '');
  const [country, setCountry] = useState(shippingAddress.country || '');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ address, city, postalCode, country }));
    navigate('/payment');
  };

  return (
    <div className="form-container">
      <CheckoutSteps step1 step2 />
      <div className="glass-panel">
        <h2 className="auth-title">Shipping Coordinates</h2>
        <form onSubmit={submitHandler}>
          <div className="form-group">
            <input type="text" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} className="input-field" required />
          </div>
          <div className="form-group">
            <input type="text" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} className="input-field" required />
          </div>
          <div className="form-group">
            <input type="text" placeholder="Postal Code" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} className="input-field" required />
          </div>
          <div className="form-group">
            <input type="text" placeholder="Country" value={country} onChange={(e) => setCountry(e.target.value)} className="input-field" required />
          </div>
          <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }}>Proceed to Payment</button>
        </form>
      </div>
    </div>
  );
};
export default ShippingScreen;
