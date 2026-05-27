import React from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ product }) => {
    return (
        <div className="product-card-luxury">
            <Link to={`/products/${product.id}`} className="product-card-link">
                <div className="product-card-image-wrapper">
                    {product.image ? (
                        <img
                            src={product.image}
                            className="product-card-image"
                            alt={product.name}
                            loading="lazy"
                        />
                    ) : (
                        <div className="product-card-placeholder">
                            <span>No Image</span>
                        </div>
                    )}
                    {product.is_featured && <div className="product-tag-luxury">Featured</div>}
                    {product.is_trending && <div className="product-tag-luxury gold">Trending</div>}
                </div>
                <div className="product-card-info">
                    {product.category?.name && (
                        <span className="product-card-category">{product.category.name}</span>
                    )}
                    <h4 className="product-card-name">{product.name}</h4>
                    <p className="product-card-price">
                        ${parseFloat(product.price).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </p>
                </div>
            </Link>
        </div>
    );
};

export default ProductCard;
