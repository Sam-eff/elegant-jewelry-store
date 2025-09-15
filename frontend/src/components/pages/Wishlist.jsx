import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import './Wishlist.css';
import Navbar from '../layouts/Navbar';

function Wishlist({ compact = false }) {
  const [wishlist, setWishlist] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate()

  const getAuthHeaders = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
    },
  });

  useEffect(() => {
    fetchWishlist(navigate);
  }, []);

  const fetchWishlist = async (navigate) => {
    try {
      const response = await axios.get('http://localhost:8000/api/wishlist/', getAuthHeaders());
      setWishlist(response.data);
    } catch (err) {
      if (err.response && err.response.status === 401 && navigate) {
        // toast.error('Please log in to add items to your wishlist.');
        // navigate('/login');
    } else {
        setError('Failed to load wishlist. You have to log in');
    }
    }
  };

  const removeFromWishlist = async (itemId) => {
    try {
      await axios.delete(`http://localhost:8000/api/wishlist/${itemId}/`, getAuthHeaders());
      fetchWishlist();
    } catch (err) {
      setError('Error removing from wishlist.');
    }
  };

  const itemsToShow = compact ? wishlist.slice(0, 3) : wishlist;

  return (
    <div className={`wishlist ${compact ? 'compact' : ''}`}>
        <h2>Your Wishlist</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {itemsToShow.length === 0 ? (
        <p>Your wishlist is empty.</p>
      ) : (
        <ul>
          {itemsToShow.map((item) => (
            <li key={item.id} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <Link to={`/products/${item.id}`}        className="text-decoration-none link">
                  <img src={item.product.image} alt={item.product.name} width="40" />
                  <p className='mb-0 '>{item.product.name}</p>
              </Link>
              {!compact && (
                <button onClick={() => removeFromWishlist(item.id)}>Remove</button>
              )}
            </li>
          ))}
        </ul>
      )}
      {!compact && (
        <button onClick={() => addToWishlist(1)}>Add Product #1</button>
      )}
    </div>
  );
}

export default Wishlist;

