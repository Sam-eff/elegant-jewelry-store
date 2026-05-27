import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaHeart, FaTrash } from 'react-icons/fa';
import { useWishlistStore } from '../store/useWishlistStore';
import ProductCard from '../components/common/ProductCard';
import './Wishlist.css';

function Wishlist({ compact = false }) {
  const { wishlist, fetchWishlist, removeFromWishlist, loading, error } = useWishlistStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const itemsToShow = compact ? wishlist.slice(0, 3) : wishlist;

  if (compact) {
    return (
      <div className="compact-wishlist-panel glass-card">
        <h3 className="compact-wishlist-title">Wishlist</h3>
        {wishlist.length === 0 ? (
          <p className="compact-wishlist-empty">Your wishlist is empty.</p>
        ) : (
          <div className="compact-wishlist-list">
            {itemsToShow.map((item) => (
              <div key={item.id} className="compact-wishlist-item">
                <Link to={`/products/${item.product.id}`} className="compact-wishlist-link">
                  <img src={item.product.image} alt={item.product.name} className="compact-wishlist-img" />
                  <span className="compact-wishlist-name">{item.product.name}</span>
                </Link>
                <button 
                  className="compact-wishlist-remove-btn" 
                  onClick={() => removeFromWishlist(item.id)}
                  title="Remove"
                >
                  ×
                </button>
              </div>
            ))}
            {wishlist.length > 3 && (
              <Link to="/wishlist" className="view-all-wishlist-link">
                View all ({wishlist.length})
              </Link>
            )}
          </div>
        )}
      </div>
    );
  }

  if (loading && wishlist.length === 0) {
    return (
      <div className="wishlist-page-loading">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading Wishlist...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-page section-padding">
      <div className="wishlist-container">
        <div className="section-title-wrapper">
          <span className="section-subtitle">Your Desires</span>
          <h2 className="section-title">Exclusive Wishlist</h2>
        </div>

        {error && <div className="luxury-alert-error">{error}</div>}

        {wishlist.length === 0 ? (
          <div className="empty-wishlist-view" data-aos="fade-up">
            <div className="empty-wishlist-icon-box">
              <FaHeart className="empty-wishlist-icon" />
            </div>
            <h3>Your Wishlist is Empty</h3>
            <p>Save items you love to your wishlist, and they will appear here for you to purchase later.</p>
            <button className="btn-luxury btn-luxury-solid mt-4" onClick={() => navigate('/products')}>
              Discover Creations
            </button>
          </div>
        ) : (
          <div className="wishlist-main-layout" data-aos="fade-up">
            <div className="wishlist-items-grid">
              {wishlist.map((item) => (
                <div key={item.id} className="wishlist-card-wrapper">
                  <ProductCard product={item.product} />
                  <button 
                    className="btn-luxury remove-wishlist-card-btn w-100" 
                    onClick={() => removeFromWishlist(item.id)}
                  >
                    <FaTrash className="me-2" /> Remove From List
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Wishlist;
