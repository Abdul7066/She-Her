import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

const OrderScreen = () => {
  const { id: orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const userInfo = useSelector((state) => state.auth.userInfo);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const { data } = await axios.get(`/api/orders/${orderId}`, config);
        setOrder(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    if (userInfo) fetchOrder();
  }, [orderId, userInfo]);

  if (loading) return <div style={{ color: 'var(--deep-lavender)', fontStyle: 'italic', textAlign: 'center', marginTop: '4rem', fontSize: '20px' }}>Retrieving order slip luxuriously...</div>;
  if (!order) return <div className="alert-box alert-danger" style={{ margin: '4rem auto', maxWidth: '600px' }}>Order documentation missing</div>;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <h2 className="page-header" style={{ marginBottom: '5px' }}>Client Receipt</h2>
      <p style={{ color: 'var(--text-light)', fontSize: '13px', letterSpacing: '1px', marginBottom: '2.5rem' }}>TRANSACTION TRACE: {order._id}</p>
      
      <div className="glass-panel">
        <h3 style={{ fontFamily: 'Playfair Display', marginBottom: '15px' }}>Identity & Dispatch</h3>
        <p style={{ color: 'var(--text-dark)', marginBottom: '8px' }}><strong>Principal: </strong> <span style={{ color: 'var(--text-light)'}}>{order.user.name}</span></p>
        <p style={{ color: 'var(--text-dark)', marginBottom: '1.5rem' }}><strong>Routing: </strong> <span style={{ color: 'var(--text-light)'}}>{order.shippingAddress.address}, {order.shippingAddress.city} {order.shippingAddress.postalCode}</span></p>
        
        <div className={`alert-box ${order.isDelivered ? 'alert-success' : 'alert-info'}`}>
          {order.isDelivered ? `Package successfully manifested on ${order.deliveredAt}` : 'Logistics Route: Pending Courier Dispatch'}
        </div>
        
        <h3 style={{ fontFamily: 'Playfair Display', marginTop: '3rem', marginBottom: '15px' }}>Gateway Verification</h3>
        <p style={{ color: 'var(--text-dark)', marginBottom: '1.5rem' }}><strong>Service Node: </strong> <span style={{ color: 'var(--text-light)'}}>{order.paymentMethod}</span></p>
        
        <div className={`alert-box ${order.isPaid ? 'alert-success' : 'alert-danger'}`}>
          {order.isPaid ? `Payment authorized gracefully on ${order.paidAt}` : 'Transaction Clearance: System awaiting Authorization'}
        </div>

        <h3 style={{ fontFamily: 'Playfair Display', borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: '10px', marginTop: '3rem', marginBottom: '1.5rem' }}>Acquisition Ledger</h3>
        {order.orderItems.map((item, index) => (
          <div key={index} className="data-row">
            <span style={{ fontWeight: 500 }}>{item.name}</span>
            <span style={{ color: 'var(--deep-pink)', fontWeight: 'bold' }}>{item.qty} x ${item.price} = ${(item.qty * item.price).toFixed(2)}</span>
          </div>
        ))}
        
        <div style={{ borderTop: '2px solid var(--primary-pink)', paddingTop: '20px', marginTop: '20px', textAlign: 'right' }}>
           <span style={{ fontSize: '18px', fontWeight: 'bold', marginRight: '1rem', color: 'var(--text-dark)' }}>Absolute Balance:</span>
           <span className="product-price" style={{ fontSize: '32px', margin: 0 }}>${order.totalPrice.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};
export default OrderScreen;
