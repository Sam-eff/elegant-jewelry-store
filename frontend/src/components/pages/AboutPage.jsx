import React from 'react';
import './AboutPage.css';

function AboutPage() {
  return (
    <div className="about-container">
      <h1>About Us</h1>
      <div className="about-content">
        <div className="about-text">
          <p>
            Welcome to <strong>Jewelry</strong>! We are passionate about creating beautiful,
            high-quality jewelry for every occasion.
          </p>
          <p>
            Each piece is crafted with care and attention to detail. Whether you're looking for
            a timeless necklace, a stunning ring, or the perfect gift, we have something special
            for you.
          </p>
        </div>
        <div className="about-image">
          <img
            src="public/img/istockphoto-1127154607-612x612.jpg"
            alt="Jewelry display"
          />
        </div>
      </div>
    </div>
  );
}

export default AboutPage;


