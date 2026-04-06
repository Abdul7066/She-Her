import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const AdminScreen = () => {
   const userInfo = useSelector((state) => state.auth.userInfo);

   const cardStyle = {
      padding: '2.5rem',
      border: '1px solid var(--deep-lavender)',
      borderRadius: '16px',
      display: 'flex',
      flexDirection: 'column',
   };

   return (
      <div style={{ padding: '4rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
         <h1 style={{ fontFamily: 'Playfair Display', fontSize: '42px', color: 'var(--text-dark)', marginBottom: '5px' }}>
            Atelier Command Center
         </h1>
         <p style={{ color: 'var(--deep-pink)', fontSize: '18px', fontWeight: 'bold', marginBottom: '3rem', textTransform: 'uppercase', letterSpacing: '2px' }}>
            Clearance Level: {userInfo?.role}
         </p>

         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {/* Inventory Flow → /admin/products */}
            <div className="glass-panel" style={cardStyle}>
               <h3 style={{ fontSize: '22px', marginBottom: '1rem' }}>Inventory Flow</h3>
               <p style={{ color: 'var(--text-light)', marginBottom: '2rem', minHeight: '60px', flexGrow: 1 }}>
                  Manage the explicit product categorical parameters, execute supply counts, and inject high-end photography media.
               </p>
               <Link to="/admin/products" id="manage-catalog-btn" style={{ textDecoration: 'none' }}>
                  <button className="btn-primary" style={{ width: '100%', padding: '12px' }}>Manage Catalog</button>
               </Link>
            </div>

            {/* Order Execution */}
            <div className="glass-panel" style={cardStyle}>
               <h3 style={{ fontSize: '22px', marginBottom: '1rem' }}>Order Execution</h3>
               <p style={{ color: 'var(--text-light)', marginBottom: '2rem', minHeight: '60px', flexGrow: 1 }}>
                  Review active transactional payloads and assign shipping configurations to validated orders.
               </p>
               <button className="btn-primary" style={{ width: '100%', padding: '12px' }}>Fulfillment Queue</button>
            </div>

            {/* Access Control */}
            <div className="glass-panel" style={{ ...cardStyle, opacity: userInfo?.role === 'admin' ? '1' : '0.5' }}>
               <h3 style={{ fontSize: '22px', marginBottom: '1rem' }}>Access Control</h3>
               <p style={{ color: 'var(--text-light)', marginBottom: '2rem', minHeight: '60px', flexGrow: 1 }}>
                  {userInfo?.role === 'admin'
                     ? 'Elevate staff accounts into the Managerial Enums explicitly defining structural access parameters.'
                     : 'Clearance Blocked. This panel mandates pure Admin capabilities. Managers may not elevate logic.'}
               </p>
               <button className="btn-secondary" disabled={userInfo?.role !== 'admin'} style={{ width: '100%', padding: '12px' }}>
                  Staff Manifest
               </button>
            </div>
         </div>
      </div>
   );
};

export default AdminScreen;

