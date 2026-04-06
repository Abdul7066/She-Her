import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const ProfileScreen = () => {
  const userInfo = useSelector((state) => state.auth.userInfo);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo) navigate('/login');
  }, [navigate, userInfo]);

  return (
    <div className="form-container glass-panel" style={{ maxWidth: '600px' }}>
      <h2 className="auth-title">Dossier Profile</h2>
      {userInfo && (
        <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div className="data-row">
            <span style={{ color: 'var(--text-light)' }}>Client Display Name:</span> 
            <span style={{ color: 'var(--text-dark)', fontWeight: '600', fontSize: '18px' }}>{userInfo.name}</span>
          </div>
          <div className="data-row">
            <span style={{ color: 'var(--text-light)' }}>Associated Node Email:</span> 
            <span style={{ color: 'var(--text-dark)', fontWeight: '600', fontSize: '18px' }}>{userInfo.email}</span>
          </div>
          <div className="data-row" style={{ borderBottom: 'none' }}>
            <span style={{ color: 'var(--text-light)' }}>Network Clearance:</span> 
            <span className="tag-pill" style={{ margin: 0, fontWeight: 'bold', background: userInfo.role === 'admin' ? 'var(--deep-pink)' : 'var(--bg-ethereal)', color: userInfo.role === 'admin' ? '#fff' : 'var(--deep-lavender)' }}>
              {userInfo.role.toUpperCase()}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
export default ProfileScreen;
