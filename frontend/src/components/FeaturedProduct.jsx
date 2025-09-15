import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { FaHeart } from 'react-icons/fa';
import { FaShoppingCart } from 'react-icons/fa';
import { useWishlistStore } from './services/WhislistApi';
import { useCartStore } from './pages/useCartStore';
import './FeaturedProduct.css';

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const { wishlist, addToWishlist, removeFromWishlist, loading, error } = useWishlistStore();
  const { addToCart, cart } = useCartStore();

  useEffect(() => {
    axios.get('http://localhost:8000/api/products/?is_featured=true')
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => {
        console.error('Failed to fetch featured products:', err);
      });
  }, []);

  return (
    <section className="featured-section" data-aos="fade-up" data-aos-delay="100">
    <h2 className="featured-title">Featured Products</h2>
    <div className="row row-cols-2 row-cols-md-4 g-4">
      {products.map((product) => {
        const isInWishlist = wishlist.some(item => item?.product?.id === product.id);
        const isInCart = cart.some(item => item?.product?.id === product.id);
        const wishlistItem = wishlist.find(item => item.product.id === product.id);
        const wishlistItemId = wishlistItem?.id;
        return (
            <div className="col" key={product.id}>
            <div className="card featured-card h-100">
            <img src={product.image} alt={product.name} className='product-image'/>
            <div className="featured-card-body">
              <h5 className="featured-card-title">{product.name}</h5>
              <p className="featured-price">${product.price}</p>
              <div className='layer'>
                {error && <p className='text-danger'>{error}</p>}
              <div className='add-btn'>
              <button
                  onClick={() => {
                    if (isInWishlist && wishlistItemId) {
                      removeFromWishlist(wishlistItemId);
                    } else {
                      addToWishlist(product.id, navigate);
                    }
                  }}
                  disabled={loading}
                >
                  {loading ? 'Processing...' : (
                    <>
                      <FaHeart /> {isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                    </>
                  )}
              </button>

              <button className={`add-to-cart ${isInCart ? 'disabled' : ''}`} onClick={() => !isInCart && addToCart(product.id, 1, navigate)}
              disabled={isInCart}>
              <FaShoppingCart /> {isInCart ? 'Already in Cart' : 'Add to Cart'}
              </button>
              </div>
            
              <Link to={`/products/${product.id}`} className="featured-button text-decoration-none">View</Link>
              </div>
            </div>
          </div>
        </div>
        )
    })}
    </div>
  </section>
  );
};

export default FeaturedProducts;

