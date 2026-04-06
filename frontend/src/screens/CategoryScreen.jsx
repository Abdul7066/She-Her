import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../features/cartSlice';
import ProductCard from '../components/ProductCard';

const CategoryScreen = () => {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get('/api/products');
        // Filter by the parsed URL category from the products array
        const productsList = data.products || data;
        const filtered = productsList.filter(p => p.category.toLowerCase() === categoryName.toLowerCase());
        setProducts(filtered);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching category products:', error);
        setLoading(false);
      }
    };
    fetchCategoryProducts();
  }, [categoryName]);

  return (
    <div style={{ padding: '2rem 0' }}>
      <div className="hero-banner" style={{ height: '250px', background: 'var(--deep-lavender)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', borderRadius: '16px', marginBottom: '3rem' }}>
         <h1 style={{ fontFamily: 'Playfair Display', fontSize: '48px', textTransform: 'capitalize' }}>
            {categoryName}
         </h1>
      </div>

      <h2 className="page-header">The Catalog</h2>

      {loading ? <p style={{ color: 'var(--text-light)' }}>Browsing {categoryName} collection...</p> : (
        <div className="product-grid">
          {products.length === 0 && (
             <p style={{fontStyle: 'italic', color: 'var(--text-light)'}}>We currently have no '{categoryName}' items curated in the collection.</p>
          )}

          {products.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryScreen;
