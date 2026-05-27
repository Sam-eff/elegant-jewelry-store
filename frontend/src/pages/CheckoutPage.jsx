import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCreditCard, FaLock, FaChevronLeft } from 'react-icons/fa';
import axiosInstance from '../services/axiosInstance';
import { toast } from 'react-toastify';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [streetAddress, setStreetAddress] = useState('');
  const [apartment, setApartment] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('stripe');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await axiosInstance.get('cart/');
        setCartItems(res.data.items);
        setLoading(false);
      } catch (err) {
        console.error(err);
        toast.error('Please log in to access checkout.');
        navigate('/login');
      }
    };

    fetchCart();
  }, [navigate]);

  const total = cartItems.reduce((sum, item) => {
    const price = item.price ?? item.product?.price ?? 0;
    return sum + price * item.quantity;
  }, 0);

  const handleCheckout = async () => {
    if (!streetAddress.trim() || !city.trim() || !state.trim() || !postalCode.trim() || !country.trim()) {
      toast.error('Please enter all required shipping address details.');
      return;
    }

    setSubmitting(true);
    try {
      const combinedAddress = `${streetAddress}${apartment.trim() ? `, ${apartment.trim()}` : ''}, ${city.trim()}, ${state.trim()} ${postalCode.trim()}, ${country.trim()}`;

      const items = cartItems.map(item => ({
        product: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
      }));

      const res = await axiosInstance.post('orders/', {
        shipping_address: combinedAddress,
        total_price: total.toFixed(2),
        is_paid: false,
        items: items,
      });

      const orderId = res.data.id;

      // Clear the cart on the backend
      await axiosInstance.delete('cart/clear/');

      // Initialize payment gateway
      const paymentRes = await axiosInstance.post('init-payment/', {
        method: paymentMethod,
        order_id: orderId,
      });

      const redirectUrl = paymentMethod === 'paystack'
        ? paymentRes.data.data.authorization_url
        : paymentRes.data.url;

      // Redirect user to payment secure checkout
      window.location.href = redirectUrl;

    } catch (err) {
      console.error(err);
      toast.error('Order processing failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="checkout-loading">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page section-padding">
      <div className="checkout-page-container">
        
        <button className="back-to-cart-btn" onClick={() => navigate('/cart')}>
          <FaChevronLeft className="me-2" /> Back to Cart
        </button>

        <div className="checkout-main-layout">
          {/* Left Column: Form Details */}
          <div className="checkout-details-column" data-aos="fade-right">
            <div className="luxury-checkout-card glass-card">
              <h3 className="checkout-step-title">1. Shipping Destination</h3>
              <div className="address-form-grid">
                <div className="form-group mb-3 full-width">
                  <label className="luxury-label" htmlFor="streetAddress">Street Address</label>
                  <input
                    type="text"
                    id="streetAddress"
                    className="luxury-input"
                    placeholder="123 Haute Avenue"
                    value={streetAddress}
                    onChange={e => setStreetAddress(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group mb-3 full-width">
                  <label className="luxury-label" htmlFor="apartment">Apartment, Suite, Unit, etc. (Optional)</label>
                  <input
                    type="text"
                    id="apartment"
                    className="luxury-input"
                    placeholder="Suite 505"
                    value={apartment}
                    onChange={e => setApartment(e.target.value)}
                  />
                </div>

                <div className="form-group-row">
                  <div className="form-group mb-3">
                    <label className="luxury-label" htmlFor="city">City</label>
                    <input
                      type="text"
                      id="city"
                      className="luxury-input"
                      placeholder="New York"
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group mb-3">
                    <label className="luxury-label" htmlFor="state">State / Province</label>
                    <input
                      type="text"
                      id="state"
                      className="luxury-input"
                      placeholder="NY"
                      value={state}
                      onChange={e => setState(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group-row">
                  <div className="form-group mb-3">
                    <label className="luxury-label" htmlFor="postalCode">Postal / ZIP Code</label>
                    <input
                      type="text"
                      id="postalCode"
                      className="luxury-input"
                      placeholder="10001"
                      value={postalCode}
                      onChange={e => setPostalCode(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group mb-3">
                    <label className="luxury-label" htmlFor="country">Country</label>
                    <input
                      type="text"
                      id="country"
                      className="luxury-input"
                      placeholder="United States"
                      value={country}
                      onChange={e => setCountry(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              <h3 className="checkout-step-title mt-5">2. Secure Payment Options</h3>
              <div className="payment-options-list">
                <label className={`payment-option-card ${paymentMethod === 'stripe' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="stripe"
                    checked={paymentMethod === 'stripe'}
                    onChange={e => setPaymentMethod(e.target.value)}
                  />
                  <div className="payment-card-content">
                    <span className="payment-method-name">Stripe Secure Checkout</span>
                    <span className="payment-method-desc">Pay safely via credit card, Apple Pay, or Google Pay.</span>
                  </div>
                  <div className="payment-logo-wrapper">
                    <img src="img/stripe.jpeg" className="stripe-img" alt="Stripe" onError={(e) => e.target.style.display='none'} />
                    <span className="fallback-badge">Stripe</span>
                  </div>
                </label>

                <label className={`payment-option-card ${paymentMethod === 'paystack' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="paystack"
                    checked={paymentMethod === 'paystack'}
                    onChange={e => setPaymentMethod(e.target.value)}
                  />
                  <div className="payment-card-content">
                    <span className="payment-method-name">Paystack Fast Transfer</span>
                    <span className="payment-method-desc">Instant online card payments, bank transfers, or mobile money.</span>
                  </div>
                  <div className="payment-logo-wrapper">
                    <img src="img/paystack.png" className="paystack-img" alt="Paystack" onError={(e) => e.target.style.display='none'} />
                    <span className="fallback-badge">Paystack</span>
                  </div>
                </label>
              </div>

              <div className="security-notice mt-4">
                <FaLock className="security-lock-icon" />
                <span>All transactions are encrypted and secured under SSL protocol.</span>
              </div>
            </div>
          </div>

          {/* Right Column: Summary Box */}
          <div className="checkout-summary-column" data-aos="fade-left">
            <div className="luxury-summary-card glass-card">
              <h3 className="summary-title">Order Overview</h3>
              
              <div className="checkout-items-summary">
                {cartItems.map(item => (
                  <div key={item.id} className="checkout-summary-item">
                    <div className="checkout-item-details">
                      <span className="checkout-item-name">{item.product?.name}</span>
                      <span className="checkout-item-qty">Qty: {item.quantity}</span>
                    </div>
                    <span className="checkout-item-price">
                      ${(Number(item.price ?? item.product?.price ?? 0) * item.quantity).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                ))}
              </div>

              <div className="summary-divider"></div>
              
              <div className="summary-row">
                <span>Shipping</span>
                <span className="gold-text">Complimentary VIP</span>
              </div>
              
              <div className="summary-row">
                <span>Signature Packaging</span>
                <span className="gold-text">Complimentary</span>
              </div>

              <div className="summary-divider"></div>

              <div className="summary-total-row">
                <span>Grand Total</span>
                <span className="summary-total-price">${total.toFixed(2)}</span>
              </div>

              <button
                className="btn-luxury btn-luxury-solid w-100 mt-4"
                onClick={handleCheckout}
                disabled={submitting || cartItems.length === 0}
              >
                <FaCreditCard className="me-2" />
                {submitting ? 'Processing Secured Portal...' : 'Initialize Secure Checkout'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
