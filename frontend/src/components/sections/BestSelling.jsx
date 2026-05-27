import React, { useEffect, useState } from 'react';
import axiosInstance from '../../services/axiosInstance';
import ProductCard from '../common/ProductCard';
import './BestSelling.css';

const BestSellingProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axiosInstance.get('products/?is_bestselling=true')
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => {
        console.error('Failed to fetch bestselling products:', err);
      });
  }, []);

  if (products.length === 0) return null;

  return (
    <section className="section-padding bestselling-section">
      <div className="section-title-wrapper" data-aos="fade-up">
        <span className="section-subtitle">Timeless Favorites</span>
        <h2 className="section-title">Best Sellers</h2>
      </div>
      <div className="products-grid" data-aos="fade-up" data-aos-delay="100">
        {products.slice(0, 4).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default BestSellingProducts;