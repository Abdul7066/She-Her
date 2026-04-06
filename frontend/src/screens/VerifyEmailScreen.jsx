import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../features/authSlice';

const VerifyEmailScreen = () => {
  const { token } = useParams();
  const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'error'
  const [message, setMessage] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      try {
        const { data } = await axios.get(`/api/auth/verify/${token}`);
        setStatus('success');
        setMessage(data.message);
        // Auto-login after verification
        if (data.token) {
          dispatch(setCredentials(data));
          setTimeout(() => navigate('/'), 3000);
        }
      } catch (err) {
        setStatus('error');
        setMessage(err.response?.data?.message || 'Verification failed. The link may be invalid or expired.');
      }
    };
    verify();
  }, [token, dispatch, navigate]);

  return (
    <div style={{
      minHeight: '80vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: '2rem',
    }}>
      <div className="glass-panel" style={{ maxWidth: '480px', width: '100%', textAlign: 'center', padding: '3rem 2.5rem' }}>

        {status === 'loading' && (
          <>
            <div style={{ fontSize: '56px', marginBottom: '1.5rem', animation: 'spin 1s linear infinite' }}>⏳</div>
            <h2 style={{ fontSize: '24px', color: 'var(--text-dark)', marginBottom: '1rem' }}>Verifying your email…</h2>
            <p style={{ color: 'var(--text-light)', fontSize: '15px' }}>Please wait a moment.</p>
            <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
          </>
        )}

        {status === 'success' && (
          <>
            <div style={{ fontSize: '64px', marginBottom: '1.5rem' }}>🎉</div>
            <h2 style={{ fontSize: '26px', color: 'var(--text-dark)', marginBottom: '0.75rem' }}>Email Verified!</h2>
            <p style={{ color: 'var(--text-light)', fontSize: '15px', lineHeight: 1.7, marginBottom: '2rem' }}>
              {message}<br />
              <span style={{ fontSize: '13px' }}>Redirecting you to the homepage in 3 seconds…</span>
            </p>
            <Link to="/" style={{ textDecoration: 'none' }}>
              <button className="btn-primary" style={{ width: 'auto', padding: '12px 32px' }}>
                Go to Homepage →
              </button>
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <div style={{ fontSize: '56px', marginBottom: '1.5rem' }}>❌</div>
            <h2 style={{ fontSize: '24px', color: 'var(--text-dark)', marginBottom: '0.75rem' }}>Verification Failed</h2>
            <p style={{ color: 'var(--text-light)', fontSize: '15px', lineHeight: 1.7, marginBottom: '2rem' }}>{message}</p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/register" style={{ textDecoration: 'none' }}>
                <button style={{ padding: '12px 24px', borderRadius: '30px', border: '1.5px solid rgba(0,0,0,0.12)', background: 'transparent', cursor: 'pointer', fontFamily: 'Inter,sans-serif', fontWeight: 600, fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Register Again
                </button>
              </Link>
              <ResendButton />
            </div>
          </>
        )}

      </div>
    </div>
  );
};

// Small resend sub-component
const ResendButton = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [showInput, setShowInput] = useState(false);

  const handleResend = async () => {
    if (!email) return;
    setSending(true);
    try {
      await axios.post('/api/auth/resend-verification', { email });
      setSent(true);
    } catch {
      // silently ignore
    } finally {
      setSending(false);
    }
  };

  if (sent) return <span style={{ padding: '12px', color: '#2e7d56', fontWeight: 600, fontSize: '13px' }}>✓ Email sent!</span>;

  if (showInput) return (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      <input
        type="email" placeholder="Enter your email"
        value={email} onChange={e => setEmail(e.target.value)}
        style={{ padding: '10px 14px', borderRadius: '30px', border: '1.5px solid rgba(0,0,0,0.15)', fontFamily: 'Inter,sans-serif', fontSize: '13px', outline: 'none', width: '200px' }}
      />
      <button onClick={handleResend} className="btn-primary" style={{ width: 'auto', padding: '10px 18px', fontSize: '12px' }} disabled={sending}>
        {sending ? '…' : 'Send'}
      </button>
    </div>
  );

  return (
    <button onClick={() => setShowInput(true)} className="btn-primary" style={{ padding: '12px 24px', width: 'auto' }}>
      Resend Email
    </button>
  );
};

export default VerifyEmailScreen;
