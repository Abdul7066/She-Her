import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/authSlice';
import RoleGuard from './RoleGuard';

const Header = () => {
  const cartItems = useSelector((state) => state.cart.cartItems);
  const userInfo = useSelector((state) => state.auth.userInfo);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <>
      <nav className="glass-nav">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button className="hamburger-btn" onClick={() => setDrawerOpen(true)}>
            <div className="bar"></div>
            <div className="bar"></div>
            <div className="bar"></div>
          </button>
          <Link to="/" className="nav-brand" style={{ marginLeft: '1.5rem' }}>
            <h1 style={{ margin: 0 }}>She and Her</h1>
          </Link>
        </div>
        <div className="nav-links">
          <Link to="/">Shop</Link>
          <Link to="/cart">Cart ({cartItems.length})</Link>
          {userInfo ? (
            <>
              <Link to="/profile">Hello, {userInfo.name}</Link>
              <RoleGuard allowedRoles={['admin', 'manager']}>
                 <Link to="/admin" style={{ color: 'var(--deep-pink)', fontWeight: 'bold' }}>Dashboard</Link>
              </RoleGuard>
              <button onClick={logoutHandler}>Logout</button>
            </>
          ) : (
            <Link to="/login">Sign In</Link>
          )}
        </div>
      </nav>

      {/* Aside Drawer Overlay */}
      <div className={`drawer-overlay ${drawerOpen ? 'open' : ''}`} onClick={() => setDrawerOpen(false)}></div>
      
      {/* Aside Drawer Panel */}
      <aside className={`drawer-panel ${drawerOpen ? 'open' : ''}`}>
        <div className="drawer-header">
          <h2 style={{ margin: 0, fontFamily: 'Playfair Display', color: 'var(--deep-lavender)' }}>Discover</h2>
          <button className="close-btn" onClick={() => setDrawerOpen(false)}>&times;</button>
        </div>
        <div className="drawer-content">
          <Link to="/category/Salwar Suits" onClick={() => setDrawerOpen(false)}>Salwar Suits</Link>
          <Link to="/category/Bridal Dresses" onClick={() => setDrawerOpen(false)}>Bridal Dresses</Link>
          <Link to="/category/Pakistani Dresses" onClick={() => setDrawerOpen(false)}>Pakistani Dresses</Link>
          <Link to="/category/Indian Daily Wear" onClick={() => setDrawerOpen(false)}>Indian Daily Wear</Link>
          <Link to="/category/Hand Bags" onClick={() => setDrawerOpen(false)}>Hand Bags</Link>
          <Link to="/category/Purses" onClick={() => setDrawerOpen(false)}>Purses</Link>
          <Link to="/category/Luxury Bags" onClick={() => setDrawerOpen(false)}>Luxury Bags</Link>
          <Link to="/category/Indo Western" onClick={() => setDrawerOpen(false)}>Indo Western</Link>
          <hr style={{ border: 'none', background: 'rgba(0,0,0,0.05)', height: '1px', margin: '1.5rem 0' }} />
          <Link to="/" onClick={() => setDrawerOpen(false)}>About She & Her</Link>
          <Link to="/" onClick={() => setDrawerOpen(false)}>Contact Us</Link>
        </div>
      </aside>
    </>
  );
}

export default Header;
