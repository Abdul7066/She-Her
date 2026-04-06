import React from 'react';

const Footer = () => {
  return (
    <footer className="glass-panel" style={{ marginTop: 'auto', borderRadius: '0', borderLeft: 'none', borderRight: 'none', borderBottom: 'none', padding: '4rem 2rem 2rem 2rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '3rem' }}>
        
        <div>
          <h3 style={{ fontFamily: 'Playfair Display', color: 'var(--deep-pink)', fontSize: '24px', marginBottom: '1.5rem' }}>She & Her</h3>
          <p style={{ color: 'var(--text-light)', lineHeight: '1.8' }}>
            Elevating modern elegance through meticulously curated haute couture. Exclusive fashion for the discerning eye.
          </p>
        </div>

        <div>
          <h4 style={{ color: 'var(--text-dark)', marginBottom: '1.5rem', fontWeight: '600' }}>Contact Atelier</h4>
          <p style={{ color: 'var(--text-light)', marginBottom: '10px' }}><strong>Email:</strong> reservations@sheandher.com</p>
          <p style={{ color: 'var(--text-light)', marginBottom: '10px' }}><strong>Phone:</strong> +1 (800) 555-0198</p>
          <p style={{ color: 'var(--text-light)' }}><strong>Boutique:</strong> 720 Fifth Avenue, New York, NY 10019</p>
        </div>

        <div>
          <h4 style={{ color: 'var(--text-dark)', marginBottom: '1.5rem', fontWeight: '600' }}>Store Policies</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: 'var(--text-light)', lineHeight: '2' }}>
            <li style={{ cursor: 'pointer' }}>Shipping & Returns</li>
            <li style={{ cursor: 'pointer' }}>Privacy Architecture</li>
            <li style={{ cursor: 'pointer' }}>Garment Care Guide</li>
            <li style={{ cursor: 'pointer' }}>Bespoke Tailoring</li>
          </ul>
        </div>
      </div>
      
      <div style={{ textAlign: 'center', marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid rgba(0,0,0,0.05)', color: 'var(--text-light)', fontSize: '13px' }}>
        <p>&copy; {new Date().getFullYear()} She & Her Private Collection. Crafted with precision.</p>
      </div>
    </footer>
  );
};

export default Footer;
