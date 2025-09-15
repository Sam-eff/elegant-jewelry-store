// src/pages/MyOrdersPage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/orders/', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setOrders(res.data);
      } catch (err) {
        toast.error('Failed to load orders');
      }
    };

    fetchOrders();
  }, [token]);

  return (
    <div className="container py-5 checkout-container">
      <h2>My Orders</h2>
      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <div className="list-group">
          {orders.map(order => (
            <div key={order.id} className="list-group-item">
              <h5>Order #{order.id}</h5>
              <p><strong>Status:</strong> {order.is_paid ? 'Paid' : 'Pending'}</p>
              <p><strong>Total:</strong> ${order.total_price}</p>
              <p><strong>Date:</strong> {new Date(order.created_at).toLocaleString()}</p>
              <p><strong>Shipping:</strong> {order.shipping_address}</p>
              <ul>
                {order.items.map(item => (
                  <li key={item.id}>{item.product_name} × {item.quantity}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
