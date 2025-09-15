import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaHeart } from 'react-icons/fa';
import { useWishlistStore } from './services/WhislistApi';
import './TopProducts.css/'

const TopProducts = ({ product }) => {
  const [products, setProducts] = useState([]);
  const { wishlist, addToWishlist, loading, error } = useWishlistStore();

  
  
  
  useEffect(() => {
      axios.get('http://localhost:8000/api/products/?is_top=true')
      .then((res) => {
          setProducts(res.data);
        })
      .catch((err) => {
          console.error('Failed to fetch top products:', err);
        });
    }, []);
    
    
    
    return (
    <section className="top-section">
    <h2 className="top-title">Top Products</h2>
    <div className="row row-cols-2 row-cols-md-4 g-4">
      {products.map(product => {
      const isInWishlist = wishlist.some(item => item?.product?.id === product.id);
      return (
        <div className="col " key={product.id}>
          <Link to={`/products/${product.id}`} className="text-decoration-none">
          <div className="card top-card h-100">
          <div className='add-to-wishlist'>
          <button onClick={() => addToWishlist(product.id)}>
          {loading ? 'Adding...' : <FaHeart/>}
          </button>
          {error && <p>{error}</p>}
          <span>
            {isInWishlist ? 'Already Added' : 'Add to wishlist'}
          </span>
          </div>
          <img src={product.image} alt={product.name} />
          <div className="top-card-body">
            <h5 className="top-card-title">{product.name}</h5>
            <p className="top-price">${product.price}</p>
            <button className="top-button">Explore</button>
          </div>
        </div>
          </Link>
        
      </div>
      );  
})}
    </div>
  </section>
  );
};

export default TopProducts;