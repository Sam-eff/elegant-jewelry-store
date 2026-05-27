import React from 'react';
import './ProductSection.css';

const mockProducts = [
  { id: 1, title: 'Sapphire Ring', price: '199', image: 'img/sapphire-geometric-ring-stockcake.jpg' },
  { id: 2, title: 'Diamond Necklace', price: '499', image: 'img/elegant-sapphire-earrings-stockcake.jpg' }
];

const ProductSection = ({ title }) => {
  return (
    <div className="product-section py-5">
      <div className="container">
        <h2 className="text-center mb-4">{title}</h2>
        <div className="row">
          {mockProducts.map(product => (
            <div className="col-md-3 mb-4" key={product.id}>
              <div className="card h-100">
                <img src={product.image} className="card-img-top" alt={product.title} />
                <div className="card-body">
                  <h5 className="card-title">{product.title}</h5>
                  <p className="card-text">${product.price}</p>
                  <button className="btn" style={{ backgroundColor: '#9A5C65', color: 'white' }}>View</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductSection;
