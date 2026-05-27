import React from 'react';
import { Link } from 'react-router-dom';
import './HeroSection.css';

const HeroSection = () => {
  return (
    <div className="hero-container-luxury">
      <div className="hero-bg-overlay"></div>
      <div className="hero-content" data-aos="fade-up">
        <span className="hero-subtitle">The Prestige Collection</span>
        <h1 className="hero-title">Timeless Artistry<br/>& Infinite Brilliance</h1>
        <p className="hero-desc">
          Indulge in our carefully curated, handcrafted premium diamond rings, necklaces, and luxury watches, designed to define elegance and tell your unique story.
        </p>
        <div className="hero-btn-group">
          <Link to="/products" className="btn-luxury btn-luxury-solid">Explore Collection</Link>
          <Link to="/about" className="btn-luxury">Our Heritage</Link>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
