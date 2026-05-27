import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaShoppingCart, FaEye } from 'react-icons/fa';
import axiosInstance from '../../services/axiosInstance';
import { useWishlistStore } from '../../store/useWishlistStore';
import { useCartStore } from '../../store/useCartStore';
import './FeaturedProduct.css';

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const { wishlist, addToWishlist, removeFromWishlist, loading: wishlistLoading } = useWishlistStore();
  const { addToCart, cart, loading: cartLoading } = useCartStore();

  useEffect(() => {
    axiosInstance.get('products/?is_featured=true')
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => {
        console.error('Failed to fetch featured products:', err);
      });
  }, []);

  if (products.length === 0) return null;

  return (
    <section className="section-padding featured-section">
      <div className="section-title-wrapper" data-aos="fade-up">
        <span className="section-subtitle">The Crown Jewels</span>
        <h2 className="section-title">Featured Creations</h2>
      </div>

      <div className="featured-grid-container" data-aos="fade-up" data-aos-delay="100">
        <div className="featured-grid">
          {products.slice(0, 4).map((product) => {
            const isInWishlist = wishlist.some(item => item?.product?.id === product.id);
            const isInCart = cart.some(item => item?.product?.id === product.id);
            const wishlistItem = wishlist.find(item => item.product?.id === product.id);
            const wishlistItemId = wishlistItem?.id;

            return (
              <div className="luxury-featured-card" key={product.id}>
                <div className="featured-image-wrapper">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="featured-image" loading="lazy" />
                  ) : (
                    <div className="featured-placeholder"><span>No Image</span></div>
                  )}
                  
                  {/* Action overlay revealed on hover */}
                  <div className="featured-action-overlay">
                    <div className="action-buttons-group">
                      <button 
                        className={`action-btn ${isInWishlist ? 'active' : ''}`}
                        title={isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
                        onClick={() => {
                          if (isInWishlist && wishlistItemId) {
                            removeFromWishlist(wishlistItemId);
                          } else {
                            addToWishlist(product.id, navigate);
                          }
                        }}
                        disabled={wishlistLoading}
                      >
                        {isInWishlist ? <FaHeart /> : <FaRegHeart />}
                      </button>

                      <Link to={`/products/${product.id}`} className="action-btn" title="View Details">
                        <FaEye />
                      </Link>

                      <button 
                        className={`action-btn ${isInCart ? 'active' : ''}`}
                        title={isInCart ? "Already in Cart" : "Add to Cart"}
                        onClick={() => !isInCart && addToCart(product.id, 1, navigate)}
                        disabled={cartLoading || isInCart}
                      >
                        <FaShoppingCart />
                      </button>
                    </div>
                  </div>
                  
                  <div className="featured-tag">Signature</div>
                </div>

                <div className="featured-info">
                  {product.category?.name && (
                    <span className="product-card-category">{product.category.name}</span>
                  )}
                  <h3 className="featured-name">{product.name}</h3>
                  <div className="featured-divider"></div>
                  <p className="featured-price-tag">
                    ${parseFloat(product.price).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
