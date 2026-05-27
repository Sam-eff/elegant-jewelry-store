import React from 'react';
import './AboutPage.css';

function AboutPage() {
  return (
    <div className="about-page section-padding">
      <div className="about-page-container">
        
        {/* Brand Heritage Section */}
        <div className="about-main-split">
          <div className="about-narrative-column" data-aos="fade-right">
            <span className="section-subtitle">Our Heritage</span>
            <h2 className="about-title">The Art of Timeless Sophistication</h2>
            
            <p className="about-paragraph highlight-paragraph">
              Elegance was founded on a singular commitment: to manifest the world's most exceptional gemstones into bespoke masterpieces of pure sophistication.
            </p>
            
            <p className="about-paragraph">
              Every creation in our catalog is engineered through traditional haute-joaillerie methods combined with modern precise casting. From the preliminary pencil sketch to the final master Polish, our in-house master artisans invest countless hours of meticulous work to ensure absolute aesthetic and physical structural perfection.
            </p>
            
            <p className="about-paragraph">
              Our gold is sustainably and ethically sourced, and our diamonds are certified under the strict Kimberley Process. We believe that true luxury lies not only in spectacular brilliance but in the pristine integrity of its origin.
            </p>
          </div>

          <div className="about-visual-column" data-aos="fade-left">
            <div className="luxury-image-frame">
              <img
                src="/img/luxury_jewelry_atelier.png"
                alt="Elegance Master Craftsman Bench"
                className="luxury-atelier-image"
              />
              <div className="frame-overlay-accent"></div>
            </div>
          </div>
        </div>

        {/* Pillars / Values Section */}
        <div className="brand-pillars-section mt-5 pt-5" data-aos="fade-up">
          <h3 className="pillars-title">The Pillars of Elegance</h3>
          <div className="pillars-grid">
            <div className="pillar-card glass-card">
              <span className="pillar-num">01</span>
              <h4 className="pillar-name">Artisan Mastery</h4>
              <p className="pillar-desc">Each piece is individually handcrafted by a master goldsmith with over a decade of dedicated expertise.</p>
            </div>
            
            <div className="pillar-card glass-card">
              <span className="pillar-num">02</span>
              <h4 className="pillar-name">Flawless Selection</h4>
              <p className="pillar-desc">Only the top 1% of ethically certified natural diamonds and precious colored gems are chosen for our collection.</p>
            </div>
            
            <div className="pillar-card glass-card">
              <span className="pillar-num">03</span>
              <h4 className="pillar-name">Bespoke Curation</h4>
              <p className="pillar-desc">We offer personalized adjustments and customized engraving on all signature collections for a unique legacy.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default AboutPage;
