import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { setCredentials } from '../features/authSlice';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [notVerified, setNotVerified] = useState(false);
  const [resent, setResent] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    setError(null);
    setNotVerified(false);
    try {
      const { data } = await axios.post('/api/auth/login', { email, password });
      dispatch(setCredentials(data));
      navigate('/');
    } catch (err) {
      if (err.response?.data?.notVerified) {
        setNotVerified(true);
      } else {
        setError(err.response?.data?.message || err.message);
      }
    }
  };

  const resendVerification = async () => {
    try {
      await axios.post('/api/auth/resend-verification', { email });
      setResent(true);
    } catch {
      // silently ignore
    }
  };

  return (
    <div className="form-container glass-panel">
      <h2 className="auth-title">Sign In</h2>

      {error && <div className="alert-box alert-danger">{error}</div>}

      {notVerified && (
        <div className="alert-box alert-info" style={{ lineHeight: 1.7 }}>
          📧 <strong>Email not verified.</strong> Please check your inbox and click the verification link.
          <br />
          {resent
            ? <span style={{ color: '#2e7d56', fontWeight: 600 }}>✓ Verification email resent!</span>
            : <button onClick={resendVerification} style={{ background: 'none', border: 'none', color: 'var(--deep-lavender)', cursor: 'pointer', fontWeight: 600, fontSize: '13px', textDecoration: 'underline', padding: 0, marginTop: '4px' }}>
                Resend verification email
              </button>
          }
        </div>
      )}

      <form onSubmit={submitHandler}>
        <div className="form-group">
          <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" required />
        </div>
        <div className="form-group">
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-field" required />
        </div>
        <button type="submit" className="btn-primary">Authenticate</button>
      </form>
      <p style={{ marginTop: '2rem', textAlign: 'center', color: 'var(--text-light)' }}>
        New clientele? <Link to="/register" style={{ color: 'var(--deep-lavender)', fontWeight: 'bold', textDecoration: 'none' }}>Register an Account</Link>
      </p>
    </div>
  );
};
export default LoginScreen;

