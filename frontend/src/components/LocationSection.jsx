import React from 'react';

const LocationSection = () => {
  return (
    <div className="location-section glass-panel" style={{ marginTop: '5rem', marginBottom: '2rem', padding: '3rem 2rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h2 className="page-header" style={{ marginBottom: '1rem' }}>Visit Our Atelier</h2>
        <p style={{ color: 'var(--text-light)', maxWidth: '600px', margin: '0 auto', fontSize: '16px' }}>
          Experience our haute couture in person. Schedule a private fitting at our flagship boutique located in the heart of the fashion district.
        </p>
      </div>

      <div className="location-grid">
        <div style={{ background: 'var(--bg-ethereal)', padding: '2.5rem', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.05)' }}>
          <h3 style={{ fontFamily: 'Playfair Display', fontSize: '24px', color: 'var(--deep-lavender)', marginBottom: '1.5rem' }}>She & Her Flagship</h3>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>Address</p>
            <p style={{ margin: 0, color: 'var(--text-light)' }}>720 Fifth Avenue<br/>New York, NY 10019</p>
          </div>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>Boutique Hours</p>
            <p style={{ margin: 0, color: 'var(--text-light)' }}>Monday - Saturday: 10:00 AM - 7:00 PM<br/>Sunday: Private Appointments Only</p>
          </div>

          <div>
            <p style={{ margin: '0 0 5px 0', fontWeight: 'bold' }}>Private Concierge</p>
            <p style={{ margin: 0, color: 'var(--deep-pink)', fontWeight: '500' }}>+1 (800) 555-0198</p>
          </div>
        </div>
        
        <div style={{ width: '100%', height: '350px', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--glass-border)' }}>
          <iframe 
            title="Boutique Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.0607567793165!2d-73.978000!3d40.761400!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c258f97bd20a4b%3A0xe54e1bb7ae7b6139!2sFifth%20Avenue%2C%20New%20York%2C%20NY!5e0!3m2!1sen!2sus!4v1689000000000!5m2!1sen!2sus" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default LocationSection;
