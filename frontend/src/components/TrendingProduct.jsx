import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './TrendingProduct.css/'

const TrendingProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/products/?is_trending=true')
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => {
        console.error('Failed to fetch trending products:', err);
      });
  }, []);

  return (
   
        <section className="trending-section">
        <h2 className="trending-title">Trendings</h2>
        <div className="row row-cols-3 row-cols-md-4 g-4">
            {products.map((product) => (
            <div className="col" key={product.id}>
                <div className="card trending-card h-100">
                <div className="trending-badge">TRENDING</div>
                <img src={product.image} alt={product.name} />
                <div className="trending-card-body">
                    <h5 className="trending-card-title">{product.name}</h5>
                    <p className="trending-price">${product.price}</p>
                    <button className="trending-button">Shop Now</button>
                </div>
                </div>
            </div>
            ))}
        </div>
        </section>
  );
};

export default TrendingProducts;

