import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaStripeS, FaMoneyCheckAlt  } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [shippingAddress, setShippingAddress] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('stripe');

  const navigate = useNavigate();

  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/cart/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCartItems(res.data.items);
        setLoading(false);
      } catch (err) {
        toast.error('Please log in to access checkout.');
        navigate('/login');
      }
    };

    fetchCart();
  }, [navigate, token]);

  const total = cartItems.reduce((sum, item) => {
    const price = item.price ?? item.product?.price ?? 0;
    return sum + price * item.quantity;
  }, 0);

  const handleCheckout = async () => {
    if (!shippingAddress.trim()) {
      toast.error('Shipping address is required.');
      return;
    }

    setSubmitting(true);
    try {
      const items = cartItems.map(item => ({
        product: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
      }));

      const res = await axios.post('http://localhost:8000/api/orders/', {
        shipping_address: shippingAddress,
        total_price: total.toFixed(2),
        is_paid: false,
        items: items,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

    const orderId = res.data.id;  // ✅ Get the new order's ID

    // ✅ Clear the cart
    await axios.delete('http://localhost:8000/api/cart/clear/', {
      headers: { Authorization: `Bearer ${token}` }
    });

    const paymentRes = await axios.post('http://localhost:8000/api/init-payment/', {
  method: paymentMethod,
      order_id: orderId,
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const redirectUrl = paymentMethod === 'paystack'
      ? paymentRes.data.data.authorization_url
      : paymentRes.data.url;

    window.location.href = redirectUrl;


    // navigate(`/order-success/${orderId}`);
    } catch (err) {
      toast.error('Order failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  

  if (loading) return <p>Loading checkout...</p>;

  return (
    <div className="container py-5 checkout-container">
      <h2>Checkout</h2>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <div className="mb-4">
            {cartItems.map(item => (
              <div key={item.id} className="border-bottom py-2">
                <strong>{item.product?.name}</strong> — {item.quantity} × ${item.product?.price}
              </div>
            ))}
          </div>

          <h5>Total: ${total.toFixed(2)}</h5>

          <div className="my-3">
            <label className="form-label">Shipping Address</label>
            <textarea
              className="form-control"
              value={shippingAddress}
              onChange={e => setShippingAddress(e.target.value)}
              rows={3}
            />
          </div>

          <div className="my-3">
            <label className="form-label">Select Payment Method</label>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="paymentMethod"
                id="stripe"
                value="stripe"
                checked={paymentMethod === 'stripe'}
                onChange={e => setPaymentMethod(e.target.value)}
              />
              <label className="form-check-label d-flex" htmlFor="stripe">
                Stripe 
              <img src="img/stripe.jpeg" className="ms-2 stripe-img" alt="" />
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="paymentMethod"
                id="paystack"
                value="paystack"
                checked={paymentMethod === 'paystack'}
                onChange={e => setPaymentMethod(e.target.value)}
              />
              <label className="form-check-label d-flex" htmlFor="paystack">
                Paystack 
                <img src="img/paystack.png" className="ms-2 paystack-img" alt="" />
              </label>
            </div>
          </div>

          <button
            className="btn btn-primary"
            onClick={handleCheckout}
            disabled={submitting}
          >
            {submitting ? 'Processing...' : 'Place Order'}
          </button>

        </>
      )}
    </div>
  );
};

export default CheckoutPage;


