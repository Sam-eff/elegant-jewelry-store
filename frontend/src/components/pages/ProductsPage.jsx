import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { FaHeart, FaShoppingCart } from 'react-icons/fa';
import { useWishlistStore } from '../services/WhislistApi';
import { useCartStore } from './useCartStore';
import './ProductsPage.css'; // Import the CSS for styling
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProductCard from '../ProductCard';


function ProductsPage( {product} ) {
  const [products, setProducts] = useState([]);
  const { wishlist, addToWishlist, loading, error } = useWishlistStore();
  const { addToCart, cart } = useCartStore();
  const navigate = useNavigate();


  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/products/');
      setProducts(response.data);
    } catch (err) {
      setError('Failed to load products.');
    }
  };

  const handleAddToWishlist = async (id) => {
    await addToWishlist(id, navigate);
    toast.success('Added to wishlist!');
};

  const handleAddToCart = async (id) => {
      await addToCart(id, 1, navigate);
      toast.success('Added to cart!');
  };





  return (
    <div className="product-list-container ">
      <h2>Product List</h2>
      {error && <p className="error-msg">{error}</p>}
      <div className="product-list">
        {products.length === 0 ? (
          <p>No products available.</p>
        ) : (
          products.map((product) => {
            const isInWishlist = wishlist.some(item => item?.product?.id === product.id);
            const isInCart = cart.some(item => item?.product?.id === product.id);
            return (
              <div key={product.id} className="product-card mt-5">
              <ProductCard product={product} />
                {/* {error && <p className='text-danger'>{error}</p>} */}
              <div className='add-to-btn mb-4'>
              <button 
               className={`${isInWishlist ? 'disabled' : ''}`}
               onClick={() => !isInWishlist && addToWishlist(product.id, navigate)} 
               disabled={isInWishlist}>
                
                {/* {loading ? 'Adding...' : <FaHeart/>} */}
                <FaHeart/> {isInWishlist ? 'Already Added' : 'Add to wishlist'}
              </button>
              <button
                className={`add-to-cart ${isInCart ? 'disabled' : ''}`}
                onClick={() => !isInCart && addToCart(product.id, 1, navigate)}
                disabled={isInCart}
                >
                <FaShoppingCart /> {isInCart ? 'Already in Cart' : 'Add to Cart'}
            </button>
            <ToastContainer position="bottom-right" autoClose={2000} />
              </div>
            </div>
            )
    })
        )}
      </div>
    </div>
  );
}

export default ProductsPage;


