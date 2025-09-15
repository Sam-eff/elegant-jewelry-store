import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import './ProductCard.css';  // You can skip if no custom styles yet

const ProductCard = ({ product }) => {
    return (
        <Link to={`/products/${product.id}`} className="text-decoration-none text-dark">
            <div className="">
                {product.image ? (
                    <img
                        src={product.image}
                        className="card-img-top rounded-top-4 mb-4"
                        alt={product.name}
                    />
                ) : (
                    <div className="no-image-placeholder d-flex justify-content-center align-items-center rounded-top-4">
                        No Image
                    </div>
                )}
                <div className="card-body text-center d-flex flex-column">
                    <h5 className="card-title">{product.name}</h5>
                    <p className="card-text mt-2 mb-4">${product.price}</p>
                    {/* <Button
                        variant="outline-primary custom-btn mt-auto"
                        onClick={(e) => e.preventDefault()}  // Prevent link-breaking when clicking button
                    >
                        View Product
                    </Button> */}
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;


