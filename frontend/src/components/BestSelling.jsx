import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './BestSelling.css/'

const BestSellingProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/products/?is_bestselling=true')
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => {
        console.error('Failed to fetch bestselling products:', err);
      });
  }, []);

  return (
   
        <section className="bestselling-section">
        <h2 className="bestselling-title">Bestselling Products</h2>
        <div className="row row-cols-2 row-cols-md-4 g-4">
          {products.map(product => (
            <div className="col" key={product.id}>
              <div className="card bestselling-card h-100">
                <img src={product.image} alt={product.name} />
                <div className="bestselling-card-body">
                  <h5 className="bestselling-card-title">{product.name}</h5>
                  <p className="bestselling-price">${product.price}</p>
                  <button className="bestselling-button">Buy Now</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
  );
};

export default BestSellingProducts;