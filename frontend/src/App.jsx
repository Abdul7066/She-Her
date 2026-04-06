import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from './features/cartSlice';

// Components
import Header from './components/Header';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import CartScreen from './screens/CartScreen';
import ShippingScreen from './screens/ShippingScreen';
import PaymentScreen from './screens/PaymentScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';
import ProfileScreen from './screens/ProfileScreen';
import ProductScreen from './screens/ProductScreen';
import CategoryScreen from './screens/CategoryScreen';
import AdminScreen from './screens/AdminScreen';
import AdminProductsScreen from './screens/AdminProductsScreen';
import VerifyEmailScreen from './screens/VerifyEmailScreen';
import RoleGuard from './components/RoleGuard';
import HeroCarousel from './components/HeroCarousel';
import Footer from './components/Footer';
import LocationSection from './components/LocationSection';
import ProductCard from './components/ProductCard';

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('/api/products');
        setProducts(data.products || data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Header />
        
        <main className="main-container" style={{ flexGrow: 1 }}>
          <Routes>
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/register" element={<RegisterScreen />} />
            <Route path="/verify/:token" element={<VerifyEmailScreen />} />
            <Route path="/cart" element={<CartScreen />} />
            <Route path="/shipping" element={<ShippingScreen />} />
            <Route path="/payment" element={<PaymentScreen />} />
            <Route path="/placeorder" element={<PlaceOrderScreen />} />
            <Route path="/order/:id" element={<OrderScreen />} />
            <Route path="/profile" element={<ProfileScreen />} />
            
            {/* Top Security Clearance Mandatory Route Map Layer */}
            <Route path="/admin" element={
              <RoleGuard allowedRoles={['admin', 'manager']}>
                <AdminScreen />
              </RoleGuard>
            } />

            <Route path="/admin/products" element={
              <RoleGuard allowedRoles={['admin', 'manager']}>
                <AdminProductsScreen />
              </RoleGuard>
            } />

            <Route path="/product/:id" element={<ProductScreen />} />
            <Route path="/category/:categoryName" element={<CategoryScreen />} />
            <Route path="/" element={
              <div>
                <HeroCarousel />

                <h2 className="page-header" style={{ marginTop: '2rem' }}>Haute Couture Discoveries</h2>
                
                {loading ? <p style={{ color: 'var(--text-light)' }}>Curating the finest apparel...</p> : (
                  <div className="product-grid">
                    {products.length === 0 && (
                       <p style={{fontStyle: 'italic', color: 'var(--text-light)'}}>The collection is currently being tailored. Admin: POST to /api/products.</p>
                    )}

                    {products.map(product => (
                      <ProductCard key={product._id} product={product} />
                    ))}
                  </div>
                )}

                <LocationSection />
              </div>
            } />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;
