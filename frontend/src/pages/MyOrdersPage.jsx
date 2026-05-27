import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../services/axiosInstance';
import { toast } from 'react-toastify';
import { FaBoxOpen, FaRegCalendarAlt, FaDollarSign, FaMapMarkerAlt, FaCompass } from 'react-icons/fa';
import './MyOrdersPage.css';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axiosInstance.get('orders/');
        setOrders(res.data);
      } catch (err) {
        console.error(err);
        toast.error('Failed to load your purchase history.');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  if (loading) {
    return (
      <div className="orders-loading">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading orders...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page section-padding">
      <div className="orders-container">
        <div className="section-title-wrapper" data-aos="fade-up">
          <span className="section-subtitle">Purchase History</span>
          <h2 className="section-title">My Orders</h2>
        </div>

        {orders.length === 0 ? (
          <div className="empty-orders-view" data-aos="fade-up">
            <div className="empty-orders-icon-box">
              <FaBoxOpen className="empty-orders-icon" />
            </div>
            <h3>No Orders Yet</h3>
            <p>You have not placed any orders yet. Discover our exclusive pieces and place your first order.</p>
            <button className="btn-luxury btn-luxury-solid mt-4" onClick={() => navigate('/products')}>
              Discover Creations
            </button>
          </div>
        ) : (
          <div className="orders-list-layout" data-aos="fade-up">
            {orders.map(order => (
              <div key={order.id} className="luxury-order-card glass-card">
                <div className="order-card-header">
                  <div className="order-header-main">
                    <span className="order-id-tag">Order #{order.id}</span>
                    <span className={`order-status-badge ${order.is_paid ? 'paid' : 'pending'}`}>
                      {order.is_paid ? 'Secured / Paid' : 'Awaiting Payment'}
                    </span>
                  </div>
                  <div className="order-header-meta">
                    <div className="meta-item">
                      <FaRegCalendarAlt className="meta-icon" />
                      <span>{new Date(order.created_at).toLocaleDateString(undefined, { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</span>
                    </div>
                  </div>
                </div>

                <div className="order-card-body">
                  <div className="order-details-grid">
                    <div className="order-destination-info">
                      <h4 className="body-section-title"><FaMapMarkerAlt className="me-2" />Shipping Address</h4>
                      <p className="destination-text">{order.shipping_address}</p>
                    </div>
                    
                    <div className="order-total-info">
                      <h4 className="body-section-title"><FaDollarSign className="me-2" />Financial Summary</h4>
                      <p className="total-text">${parseFloat(order.total_price).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                    </div>
                  </div>

                  <div className="order-items-section mt-4">
                    <h4 className="body-section-title"><FaCompass className="me-2" />Selected Items</h4>
                    <div className="order-items-list">
                      {order.items.map(item => (
                        <div key={item.id} className="order-item-row">
                          <span className="order-item-name">{item.product_name}</span>
                          <span className="order-item-qty">Qty: {item.quantity}</span>
                          <span className="order-item-price">
                            ${parseFloat(item.price).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
