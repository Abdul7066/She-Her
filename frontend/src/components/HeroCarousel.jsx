import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const HeroCarousel = () => {
  const [current, setCurrent] = useState(0);

  const slides = [
    {
      image: "/images/teal_suit_poster_1775405044961.png",
      title: "The Teal Collection",
      subtitle: "Discover the Elegance of Raw Silk",
      color: "var(--deep-lavender)"
    },
    {
      image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop",
      title: "The Spring Serenity Collection",
      subtitle: "Discover ethereal beauty."
    },
    {
      image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=2070&auto=format&fit=crop",
      title: "Pastel Elegance",
      subtitle: "Modern tailoring redefined."
    },
    {
      image: "https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?q=80&w=2070&auto=format&fit=crop",
      title: "Accessories Unveiled",
      subtitle: "Subtle statements for bold spaces."
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="carousel-container">
      {slides.map((slide, index) => (
        <div 
          key={index} 
          className={`carousel-slide ${index === current ? 'active' : ''}`}
          style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${slide.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
          <div className="hero-content">
            <h1>{slide.title}</h1>
            <p>{slide.subtitle}</p>
          </div>
        </div>
      ))}
      <div className="carousel-dots">
        {slides.map((_, index) => (
          <span 
            key={index} 
            className={`dot ${index === current ? 'active' : ''}`}
            onClick={() => setCurrent(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
