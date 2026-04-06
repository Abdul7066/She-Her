import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { addToCart } from '../features/cartSlice';
import ProductCard from '../components/ProductCard';

const ProductScreen = () => {
  const { id } = useParams();
  const [product, setProduct] = useState({});
  const [similarProducts, setSimilarProducts] = useState([]);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Review States
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewStatus, setReviewStatus] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const userInfo = useSelector((state) => state.auth.userInfo);

  const fetchProduct = async () => {
    try {
      const { data } = await axios.get(`/api/products/${id}`);
      setProduct(data);
      
      try {
         const globalData = await axios.get('/api/products');
         const allProducts = globalData.data.products || globalData.data;
         const filtered = allProducts.filter(item => item.category === data.category && item._id !== data._id);
         setSimilarProducts(filtered);
      } catch(e) { console.error('Silent failure ignoring recommendation load issues', e) }

      setLoading(false);
    } catch (err) {
      console.error(err);
      setError(err.response && err.response.data.message ? err.response.data.message : err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, product: product._id, qty: Number(qty) }));
    navigate('/cart');
  };

  const submitReviewHandler = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      await axios.post(`/api/products/${id}/reviews`, { rating, comment }, config);
      setReviewStatus({ type: 'success', message: 'Review successfully added to the collection!' });
      setRating(5);
      setComment('');
      fetchProduct(); // Refresh aggregate UI parameters
    } catch (error) {
      setReviewStatus({ 
         type: 'error', 
         message: error.response && error.response.data.message ? error.response.data.message : error.message 
      });
    }
  };

  if (loading) return <h2 style={{ textAlign: 'center', marginTop: '4rem', color: 'var(--text-light)' }}>Retrieving Exquisite Details...</h2>;
  if (error) return <div style={{ textAlign: 'center', marginTop: '6rem' }}><h2 style={{ color: 'var(--deep-pink)', marginBottom: '1rem' }}>{error}</h2><p style={{ color: 'var(--text-light)', marginBottom: '2rem' }}>This item may have been removed from the catalog database.</p><Link to="/" className="btn-primary" style={{ textDecoration: 'none' }}>Return to Homepage</Link></div>;
  if (!product || !product._id) return <div style={{ textAlign: 'center', marginTop: '6rem' }}><h2 style={{ color: 'var(--deep-pink)', marginBottom: '1rem' }}>Product Not Found</h2><p style={{ color: 'var(--text-light)', marginBottom: '2rem' }}>The product you are looking for does not exist in the current database.</p><Link to="/" className="btn-primary" style={{ textDecoration: 'none' }}>Return to Homepage</Link></div>;

  return (
    <div className="product-view-layout">
      <Link to="/" className="btn-secondary" style={{ display: 'inline-block', marginBottom: '2rem', textDecoration: 'none', color: 'var(--text-light)' }}>
        &larr; Back to Atelier
      </Link>
      
      <div className="product-spotlight">
        <div className="product-image-grand glass-panel" style={{ padding: '1rem' }}>
          <img src={product.imageUrl} alt={product.name} style={{ width: '100%', borderRadius: '12px', objectFit: 'cover' }} />
        </div>
        
        <div className="product-details-grand glass-panel">
          <h1 style={{ fontSize: '38px', color: 'var(--text-dark)', marginBottom: '5px' }}>{product.name}</h1>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
             <span style={{ color: '#f8e825', fontSize: '20px' }}>★</span>
             <span style={{ marginLeft: '4px', fontWeight: '600', fontSize: '18px' }}>{product.rating ? product.rating.toFixed(1) : '5.0'}</span>
             <span style={{ marginLeft: '6px', color: 'var(--text-light)', fontSize: '14px' }}>({product.numReviews || 0} reviews)</span>
          </div>
          
          <hr style={{ border: 'none', height: '1px', background: 'var(--glass-border)', marginBottom: '1.5rem' }} />
          
          <h2 style={{ color: 'var(--deep-lavender)', fontSize: '32px', marginBottom: '2rem' }}>${product.price?.toFixed(2)}</h2>
          
          <div style={{ marginBottom: '2rem' }}>
             <span className="tag-pill" style={{ marginRight: '10px' }}>{product.category}</span>
             {product.sizes && product.sizes.map(s => <span key={s} className="tag-pill" style={{ background: 'transparent' }}>Size {s}</span>)}
             {product.colors && product.colors.map(c => <span key={c} className="tag-pill" style={{ background: 'var(--deep-pink)', color: 'white', border: 'none' }}>{c}</span>)}
          </div>
          
          <p style={{ lineHeight: '1.8', color: 'var(--text-light)', marginBottom: '3rem', fontSize: '15px' }}>
            {product.description}
          </p>

          <div className="action-box">
             <div className="data-row">
               <span>Availability:</span>
               <span style={{ fontWeight: 'bold', color: product.inStock ? 'var(--deep-lavender)' : 'var(--deep-pink)' }}>{product.inStock ? 'In Stock' : 'Out of Stock'}</span>
             </div>
             
             {product.inStock && (
                <div className="data-row">
                  <span>Quantity:</span>
                  <select value={qty} onChange={(e) => setQty(e.target.value)} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.1)' }}>
                     {[1, 2, 3, 4, 5].map((x) => (
                       <option key={x} value={x}>{x}</option>
                     ))}
                  </select>
                </div>
             )}
             
             <button 
                onClick={addToCartHandler} 
                disabled={!product.inStock} 
                className="btn-primary" 
                style={{ marginTop: '2rem', padding: '16px' }}>
                {product.inStock ? "Add to Private Collection" : "Waitlist Selection"}
             </button>
          </div>
        </div>
      </div>

      {/* Review Sub-System Section */}
      <div className="glass-panel" style={{ marginTop: '4rem', padding: '3rem' }}>
         <h2 style={{ fontFamily: 'Playfair Display', fontSize: '32px', marginBottom: '2rem' }}>Client Reviews</h2>
         
         <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '4rem' }} className="location-grid">
            
            {/* Reviews Render List */}
            <div>
               {product.reviews && product.reviews.length === 0 && <p className="alert-info">No reviews have been written for this piece yet.</p>}
               
               {product.reviews && product.reviews.map((review) => (
                  <div key={review._id} style={{ marginBottom: '2rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>
                     <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <span style={{ fontWeight: 'bold', marginRight: '1rem' }}>{review.name}</span>
                        <span style={{ color: '#f8e825' }}>{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
                     </div>
                     <p style={{ color: 'var(--text-light)', fontSize: '14px', fontStyle: 'italic' }}>{review.comment}</p>
                     <p style={{ fontSize: '11px', color: '#999', marginTop: '0.5rem' }}>{review.createdAt.substring(0, 10)}</p>
                  </div>
               ))}
            </div>

            {/* Review Submission Hook */}
            <div style={{ background: 'rgba(255,255,255,0.4)', padding: '2rem', borderRadius: '16px' }}>
               <h3 style={{ fontSize: '20px', marginBottom: '1.5rem' }}>Write a Review</h3>
               
               {reviewStatus && (
                 <div className={reviewStatus.type === 'error' ? 'alert-danger alert-box' : 'alert-success alert-box'}>
                   {reviewStatus.message}
                 </div>
               )}

               {userInfo ? (
                  <form onSubmit={submitReviewHandler}>
                     <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Rating</label>
                        <select className="input-field" value={rating} onChange={(e) => setRating(e.target.value)}>
                           <option value="5">5 - Excellent</option>
                           <option value="4">4 - Very Good</option>
                           <option value="3">3 - Good</option>
                           <option value="2">2 - Fair</option>
                           <option value="1">1 - Poor</option>
                        </select>
                     </div>
                     <div className="form-group">
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Your Experience</label>
                        <textarea 
                          className="input-field" 
                          rows="4" 
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          placeholder="How did this piece fit? Comment on the fabric quality..."
                          required
                        />
                     </div>
                     <button type="submit" className="btn-primary" style={{ padding: '12px' }}>Submit Review</button>
                  </form>
               ) : (
                  <div className="alert-info" style={{ marginTop: '1rem' }}>
                     Please <Link to="/login" style={{ fontWeight: 'bold' }}>sign in</Link> to share your experience with this item.
                  </div>
               )}
            </div>
         </div>
      </div>

      {/* Intelligent Category Recommendation Ribbon */}
      {similarProducts.length > 0 && (
         <div style={{ marginTop: '5rem', padding: '0 1rem' }}>
            <h2 style={{ fontFamily: 'Playfair Display', fontSize: '32px', marginBottom: '2rem', textAlign: 'left', color: 'var(--text-dark)' }}>
               You May Also Fall In Love With...
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: '2rem' }}>
               <div style={{ display: 'flex', gap: '2rem', overflowX: 'auto', overflowY: 'hidden', paddingBottom: '2rem', width: '100%', scrollSnapType: 'x mandatory' }}>
                  {similarProducts.map(item => (
                     <div key={item._id} style={{ minWidth: '350px', maxWidth: '350px', scrollSnapAlign: 'start' }}>
                        <ProductCard product={item} />
                     </div>
                  ))}
               </div>
            </div>
         </div>
      )}
    </div>
  );
};

export default ProductScreen;
