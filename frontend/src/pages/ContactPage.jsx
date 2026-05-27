import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import axiosInstance from '../services/axiosInstance';
import './ContactPage.css';

function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await axiosInstance.post('contact/', form);
      toast.success('Your message has been received by our concierge service. We will respond promptly.');
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      console.error(err);
      toast.error('Unable to send message at this time. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="contact-page section-padding">
      <div className="contact-page-container">
        
        <div className="section-title-wrapper" data-aos="fade-up">
          <span className="section-subtitle">Concierge Desk</span>
          <h2 className="section-title">Connect With Elegance</h2>
          <p className="catalog-intro-text text-center">
            Our luxury advisory team is standing by to assist you with inquiries, custom creations, or private viewings.
          </p>
        </div>

        <div className="contact-main-layout">
          {/* Left Column: Contact Form */}
          <div className="contact-form-column" data-aos="fade-right">
            <div className="luxury-contact-card glass-card">
              <h3 className="contact-card-title">Send a Private Message</h3>
              <form onSubmit={handleSubmit} className="luxury-contact-form">
                <div className="form-group mb-4">
                  <label className="luxury-label" htmlFor="name">Your Name</label>
                  <input 
                    type="text" 
                    id="name"
                    name="name" 
                    className="luxury-input" 
                    placeholder="Enter your full name" 
                    value={form.name} 
                    onChange={handleChange} 
                    required 
                  />
                </div>

                <div className="form-group mb-4">
                  <label className="luxury-label" htmlFor="email">Email Address</label>
                  <input 
                    type="email" 
                    id="email"
                    name="email" 
                    className="luxury-input" 
                    placeholder="Enter your email address" 
                    value={form.email} 
                    onChange={handleChange} 
                    required 
                  />
                </div>

                <div className="form-group mb-5">
                  <label className="luxury-label" htmlFor="message">Your Inquiry</label>
                  <textarea 
                    id="message"
                    name="message" 
                    className="luxury-input" 
                    rows="5" 
                    placeholder="How may our concierge assist you today?" 
                    value={form.message} 
                    onChange={handleChange} 
                    required 
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn-luxury btn-luxury-solid w-100"
                  disabled={submitting}
                >
                  {submitting ? 'Transmitting inquiry...' : 'Send Secured Message'}
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Direct Info & Map */}
          <div className="contact-info-column" data-aos="fade-left">
            <div className="concierge-details-card glass-card">
              <h3 className="contact-card-title">Concierge Directory</h3>
              
              <div className="directory-list">
                <div className="directory-item">
                  <FaPhoneAlt className="directory-icon" />
                  <div className="directory-meta">
                    <span className="directory-label">Concierge Hotline</span>
                    <span className="directory-val">+1 (800) ELEGANCE</span>
                  </div>
                </div>

                <div className="directory-item">
                  <FaEnvelope className="directory-icon" />
                  <div className="directory-meta">
                    <span className="directory-label">Direct Inquiry</span>
                    <span className="directory-val">concierge@elegancejewelry.com</span>
                  </div>
                </div>

                <div className="directory-item">
                  <FaMapMarkerAlt className="directory-icon" />
                  <div className="directory-meta">
                    <span className="directory-label">Signature Atelier</span>
                    <span className="directory-val">Fifth Avenue & 34th St, New York, NY 10118</span>
                  </div>
                </div>

                <div className="directory-item">
                  <FaClock className="directory-icon" />
                  <div className="directory-meta">
                    <span className="directory-label">Atelier Hours</span>
                    <span className="directory-val">Monday – Saturday: 10:00 AM – 7:00 PM EST</span>
                  </div>
                </div>
              </div>

              {/* Map embedded */}
              <div className="contact-map-frame mt-4">
                <iframe
                  title="Elegance NYC Flagship Location Map"
                  width="100%"
                  height="100%"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3021.764038879545!2d-73.98565698459354!3d40.748817979327585!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259af18d5aef3%3A0xaca43d87e0c6a8f0!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1683601417621!5m2!1sen!2sus"
                  allowFullScreen
                  loading="lazy"
                ></iframe>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default ContactPage;
