import React from 'react';
import Carousel from 'react-bootstrap/Carousel';
import './HeroSection.css';

const HeroSection = () => {
  return (
    <div className="hero-section text-white" data-aos="fade-up">
      <Carousel fade>
        <Carousel.Item>
          <img className="d-block w-100" src="/img/slide-img2.jpg" alt="First slide" />
          <Carousel.Caption>
            <h1>Elegance Redefined</h1>
            <p>Discover timeless pieces for every moment.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <img className="d-block w-100" src="/img/slide-img3.jpg" alt="Second slide" />
          <Carousel.Caption>
            <h1 className='caption2'>Luxury that Speaks</h1>
            <p className='caption2'>Handpicked designs for your collection.</p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
    </div>
  );
};

export default HeroSection;
