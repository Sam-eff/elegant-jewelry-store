import React from 'react';
import { Link } from 'react-router-dom';
import './AtelierSpotlight.css';

function AtelierSpotlight() {
  return (
    <section className="atelier-spotlight-section">
      <div className="atelier-container">
        
        {/* Asymmetric Split Layout */}
        <div className="atelier-grid">
          
          {/* Left Block - The Story & Craft */}
          <div className="atelier-story-block" data-aos="fade-right">
            <span className="atelier-subtitle">Atelier Heritage</span>
            <h2 className="atelier-title">The Artistry Behind the Brilliance</h2>
            <div className="atelier-ornament">✦ ✦ ✦</div>
            <p className="atelier-description">
              Step inside the private salon where master craftsman design our signature, custom-tailored collections. Each piece undergoes hundreds of hours of precise gem-selection, hand-forging, and micrometric setting.
            </p>
            <p className="atelier-description secondary">
              Our gold is sustainably sourced, alloyed to a proprietary high-brilliance luster, and polished by hand to capture and cascade ambient light like no other.
            </p>
            <div className="atelier-btn-wrapper">
              <Link to="/about" className="btn-luxury btn-luxury-solid">Our Craftsmanship</Link>
            </div>
          </div>
          
          {/* Right Block - The Visual Image with Gold Deco Frame */}
          <div className="atelier-visual-block" data-aos="fade-left">
            <div className="atelier-image-frame">
              <div className="atelier-frame-accent-corner top-left"></div>
              <div className="atelier-frame-accent-corner bottom-right"></div>
              <img 
                src="/img/luxury_jewelry_atelier.png" 
                alt="Elegance Master Atelier Craftsmanship" 
                className="atelier-image" 
                loading="lazy"
              />
              <div className="atelier-floating-glass-badge">
                <span className="badge-title">ESTABLISHED</span>
                <span className="badge-year">1998</span>
              </div>
            </div>
          </div>
          
        </div>
        
      </div>
    </section>
  );
}

export default AtelierSpotlight;
