// src/pages/ContactPage.jsx
import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import './ContactPage.css'

function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        await axios.post('http://localhost:8000/api/contact/', form);
        setForm({ name: '', email: '', message: '' });
      } catch (err) {
        toast.error('Failed to send message. Please try again later.');
      }
      
    
    // 👉 send to backend later
    console.log('Submitting form:', form);
    
    toast.success('Thank you! We received your message.');

    setForm({ name: '', email: '', message: '' });
  };


  return (
    <div className="contact-container mt-4 ">
      <ToastContainer position="top-center" />
      <h1>Contact Us</h1>
      <form onSubmit={handleSubmit} className="contact-form">
        <label>Name:</label>
        <input type="text" name="name" value={form.name} onChange={handleChange} required />

        <label>Email:</label>
        <input type="email" name="email" value={form.email} onChange={handleChange} required />

        <label>Message:</label>
        <textarea name="message" rows="4" value={form.message} onChange={handleChange} required />

        <button type="submit">Send Message</button>
      </form>

      <div className="contact-map">
        <iframe
          title="Google Map"
          width="100%"
          height="100%"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3021.764038879545!2d-73.98565698459354!3d40.748817979327585!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259af18d5aef3%3A0xaca43d87e0c6a8f0!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1683601417621!5m2!1sen!2sus"
          allowFullScreen
          loading="lazy"
        ></iframe>
      </div>
    </div>
  );
}

export default ContactPage;

