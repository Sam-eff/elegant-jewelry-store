import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaShoppingBag, FaArrowRight, FaPrint } from 'react-icons/fa';
import axiosInstance from '../services/axiosInstance';
import confetti from 'canvas-confetti';
import './OrderSuccessPage.css';

function OrderSuccessPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        await axiosInstance.get(`payments/stripe/verify/${id}/`);
      } catch (err) {
        console.error('Payment verification failed:', err);
      }
    };
  
    verifyPayment();
  }, [id]);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axiosInstance.get(`orders/${id}/`);
        setOrder(res.data);
      } catch (err) {
        console.error('Failed to load order details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  useEffect(() => {
    if (order) {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#d4af37', '#f5f5f5', '#aa7c11']
      });
    }
  }, [order]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="success-page-loading">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Validating payment status...</span>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="success-page-error container section-padding">
        <div className="luxury-error-card">
          <h2>Transaction Incomplete</h2>
          <p>We were unable to retrieve transaction details for Order Reference #{id}.</p>
          <button className="btn-luxury btn-luxury-solid mt-4" onClick={() => navigate('/products')}>
            Back to Gallery
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="order-success-page section-padding">
      <div className="success-container" data-aos="zoom-in">
        <div className="luxury-success-card glass-card">
          <div className="success-icon-box">
            <FaCheckCircle className="success-icon" />
          </div>

          <span className="success-subtitle">Payment Verified</span>
          <h2 className="success-title">Order Complete</h2>
          <p className="success-intro">Thank you for your acquisition. We are preparing your precious selections under absolute VIP protocols.</p>

          <div className="success-order-details mt-5">
            <div className="receipt-header">
              <span className="receipt-order-id">Order Reference: #{order.id}</span>
              <button className="print-receipt-btn" onClick={handlePrint} title="Print Invoice">
                <FaPrint /> Print Invoice
              </button>
            </div>
            
            <div className="receipt-divider"></div>

            <div className="receipt-items-list">
              {order.items.map(item => (
                <div key={item.id} className="receipt-item-row">
                  <div className="receipt-item-meta">
                    <span className="receipt-item-name">{item.product_name}</span>
                    <span className="receipt-item-qty">Quantity: {item.quantity}</span>
                  </div>
                  <span className="receipt-item-price">
                    ${(Number(item.price) * item.quantity).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              ))}
            </div>

            <div className="receipt-divider"></div>

            <div className="receipt-totals">
              <div className="receipt-total-row">
                <span>Total Value</span>
                <span className="receipt-grand-total">${parseFloat(order.total_price).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>

          <div className="success-actions mt-5">
            <Link to="/my-orders" className="btn-luxury btn-luxury-solid d-inline-flex align-items-center">
              <FaShoppingBag className="me-2" /> View Order History
            </Link>
            <Link to="/products" className="btn-luxury ms-3 d-inline-flex align-items-center">
              Discover Gallery <FaArrowRight className="ms-2" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccessPage;