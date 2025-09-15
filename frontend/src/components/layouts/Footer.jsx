import React from 'react';
import './Footer.css';
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-container">
        
        <div className="footer-section brand">
          <h3>Elegant Jewelry</h3>
          <p>Shine bright with our premium collections. Designed to perfection.</p>
        </div>

        <div className="footer-section links">
          <h5>Quick Links</h5>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/products">Products</a></li>
            <li><a href="/cart">Cart</a></li>
            <li><a href="/wishlist">Wishlist</a></li>
          </ul>
        </div>

        <div className="footer-section links">
          <h5>Customer Service</h5>
          <ul>
            <li><a href="/">Contact Us</a></li>
            <li><a href="/">Returns</a></li>
            <li><a href="/">FAQs</a></li>
            <li><a href="/">Terms & Policies</a></li>
          </ul>
        </div>

        <div className="footer-section social">
          <h5>Follow Us</h5>
          <div className="social-icons">
            <a href="/"><FaFacebookF /></a>
            <a href="/"><FaInstagram /></a>
            <a href="/"><FaTwitter /></a>
            <a href="/"><FaYoutube /></a>
          </div>
        </div>

      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Elegant Jewelry. All Rights Reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;

