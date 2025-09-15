import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import confetti from 'canvas-confetti';


function OrderSuccessPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyPayment = async () => {
      const token = localStorage.getItem('accessToken');
      try {
        await axios.get(`http://localhost:8000/api/payments/stripe/verify/${id}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (err) {
        console.error('Payment verification failed:', err);
      }
    };
  
    verifyPayment();
  }, [id]);
  

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const res = await axios.get(`http://localhost:8000/api/orders/${id}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrder(res.data);
      } catch (err) {
        console.error('Failed to load order:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  useEffect(() => {
    if (order) {
      confetti({
        particleCount: 100,
        spread: 360,
        origin: { x: 0.5, y: 0.5 },
      });
    }
  }, [order]);

  if (loading) return <div className="container mt-5">Loading...</div>;

  if (!order) return <div className="container mt-5">Order not found.</div>;


  return (
    <div className="container mt-5 checkout-container">
      <h2 className='emoji-bounce'>Thank you! 🎉</h2>
      <p>Your order #{order.id} has been placed successfully.</p>
      <p>Total: ${order.total_price}</p>
      <h4>Items:</h4>
      <ul>
        {order.items.map(item => (
          <li key={item.product}>
            {item.quantity} × {item.product_name} = ${item.price * item.quantity}
          </li>
        ))}
      </ul>
      <button className='order-btn'>
      <Link to="/my-orders" className="text-decoration-none  text-white  ">View Order History</Link>
      </button>

    </div>
  );
}

export default OrderSuccessPage;