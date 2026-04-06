import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [registered, setRegistered] = useState(false);
  const [resent, setResent] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await axios.post('/api/auth/register', { name, email, password });
      setRegistered(true);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const resendEmail = async () => {
    try {
      await axios.post('/api/auth/resend-verification', { email });
      setResent(true);
    } catch {
      // silently ignore
    }
  };

  if (registered) {
    return (
      <div className="form-container glass-panel" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
        <div style={{ fontSize: '60px', marginBottom: '1.5rem' }}>📬</div>
        <h2 className="auth-title" style={{ marginBottom: '1rem' }}>Check Your Inbox</h2>
        <p style={{ color: 'var(--text-light)', lineHeight: 1.8, marginBottom: '2rem' }}>
          We've sent a verification link to <strong style={{ color: 'var(--deep-lavender)' }}>{email}</strong>.
          <br />Click the link in the email to activate your account.
        </p>
        {resent
          ? <div className="alert-box alert-success">✓ Verification email resent!</div>
          : <button onClick={resendEmail} style={{ background: 'none', border: 'none', color: 'var(--deep-lavender)', cursor: 'pointer', fontWeight: 600, fontSize: '14px', textDecoration: 'underline' }}>
              Didn't receive it? Resend email
            </button>
        }
        <p style={{ marginTop: '2rem', color: 'var(--text-light)', fontSize: '14px' }}>
          Already verified? <Link to="/login" style={{ color: 'var(--deep-pink)', fontWeight: 'bold', textDecoration: 'none' }}>Sign In</Link>
        </p>
      </div>
    );
  }

  return (
    <div className="form-container glass-panel">
      <h2 className="auth-title">Join She &amp; Her</h2>
      {error && <div className="alert-box alert-danger">{error}</div>}
      <form onSubmit={submitHandler}>
        <div className="form-group">
          <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} className="input-field" required />
        </div>
        <div className="form-group">
          <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" required />
        </div>
        <div className="form-group">
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-field" required />
        </div>
        <button type="submit" className="btn-primary">Become a Member</button>
      </form>
      <p style={{ marginTop: '2rem', textAlign: 'center', color: 'var(--text-light)' }}>
        Already a member? <Link to="/login" style={{ color: 'var(--deep-lavender)', fontWeight: 'bold', textDecoration: 'none' }}>Sign In</Link>
      </p>
    </div>
  );
};

export default RegisterScreen;

