import { useState } from 'react';
import './Newsletter.css';

function Newsletter() {
  const [email, setEmail] = useState('');
  


  return (
    <section className="newsletter-section" data-aos="fade-up">
      <div className="container">
        <h2 className="newsletter-title">Stay Updated</h2>
        <p className="newsletter-subtitle">Subscribe for exclusive offers & updates</p>
        <form className="newsletter-form">
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Enter your email" required />
          <button type="submit">Subscribe</button>
        </form>
      </div>
    </section>
  );
}

export default Newsletter;

