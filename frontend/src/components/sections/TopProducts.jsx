import React, { useEffect, useState } from 'react';
import axiosInstance from '../../services/axiosInstance';
import ProductCard from '../common/ProductCard';
import './TopProducts.css';

const TopProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axiosInstance.get('products/?is_top=true')
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => {
        console.error('Failed to fetch top products:', err);
      });
  }, []);

  if (products.length === 0) return null;

  return (
    <section className="section-padding top-products-section">
      <div className="section-title-wrapper" data-aos="fade-up">
        <span className="section-subtitle">Curated Perfection</span>
        <h2 className="section-title">Top Selections</h2>
      </div>
      <div className="products-grid" data-aos="fade-up" data-aos-delay="100">
        {products.slice(0, 4).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default TopProducts;