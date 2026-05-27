import React, { useEffect, useState } from 'react';
import axiosInstance from '../../services/axiosInstance';
import ProductCard from '../common/ProductCard';
import './TrendingProduct.css';

const TrendingProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axiosInstance.get('products/?is_trending=true')
      .then((res) => setProducts(res.data))
      .catch((err) => console.error('Failed to fetch trending products:', err));
  }, []);

  if (products.length === 0) return null;

  return (
    <section className="section-padding trending-section">
      <div className="section-title-wrapper" data-aos="fade-up">
        <span className="section-subtitle">What's Hot</span>
        <h2 className="section-title">Trending Now</h2>
      </div>
      <div className="products-grid" data-aos="fade-up" data-aos-delay="100">
        {products.slice(0, 4).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default TrendingProducts;
