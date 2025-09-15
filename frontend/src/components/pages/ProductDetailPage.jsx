import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { FaHeart, FaShoppingCart } from 'react-icons/fa';
import { useWishlistStore } from '../services/WhislistApi';
import { useCartStore } from './useCartStore';
import { Spinner, Button, InputGroup, FormControl, Alert } from 'react-bootstrap';
import './ProductDetailPage.css';

const ProductDetailPage = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });
    const [submitting, setSubmitting] = useState(false);



    const { wishlist, addToWishlist } = useWishlistStore();
    const { cart, addToCart } = useCartStore();

    useEffect(() => {
        fetchProduct();
        fetchRelated();
    }, [id]);

    const fetchProduct = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/products/${id}/`);
            setProduct(response.data);
        } catch (err) {
            console.error(err);
            setError('Failed to load product.');
        } finally {
            setLoading(false);
        }
    };


    const fetchRelated = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/products/${id}/related/`);
            setRelatedProducts(response.data);
        } catch (err) {
            console.error('Failed to load related products');
        }
    };

    const handleReviewChange = (e) => {
        const { name, value } = e.target;
        setReviewData((prev) => ({ ...prev, [name]: value }));
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
            toast.error('Please log in to submit a review.');
            navigate('/login');
            return;
        }
        setSubmitting(true);
        try {
            await axios.post(
                `http://localhost:8000/api/products/${id}/reviews/`,
                reviewData,
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            setReviewData({ rating: 5, comment: '' });
            await fetchProduct();  // ✅ Re-fetch the whole product to refresh reviews
            toast.success('Review submitted!');

        } catch (err) {
            if (err.response && err.response.status === 400) {
                toast.error(err.response.data.detail || 'You have already reviewed this product.');
            } else {
                toast.error('Failed to submit review.');
            }
            console.error(err);
            toast.error('Failed to submit review.');
        } finally {
            setSubmitting(false);
        }
    };
    
    

    const isInWishlist = wishlist.some(item => item?.product?.id === product?.id);
    const isInCart = cart.some(item => item?.product?.id === product?.id);

    const handleQuantityChange = (e) => {
        const value = Math.max(1, parseInt(e.target.value) || 1);
        setQuantity(value);
    };

    if (loading) {
        return (
            <div className="text-center mt-5">
                <Spinner animation="border" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mt-5">
                <Alert variant="danger">{error}</Alert>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="container mt-5">
                <Alert variant="info">No product found.</Alert>
            </div>
        );
    }

    return (
        <div className="container product-detail-modern mt-4">
            <div className="row align-items-start">
                <div className="col-lg-6 mb-4">
                    <div className="product-image-card shadow-sm rounded-4">
                        {product.image ? (
                            <img
                                src={product.image}
                                alt={product.name}
                                className="img-fluid rounded-4 product-main-image"
                            />
                        ) : (
                            <div className="no-image-placeholder d-flex justify-content-center align-items-center rounded-4">
                                No Image Available
                            </div>
                        )}
                    </div>
                </div>
                <div className="col-lg-6">
                    <div className="product-info-card shadow-sm rounded-4 p-4">
                        <h1 className="product-title">{product.name}</h1>
                        <h2 className="product-price mb-3">${product.price}</h2>
                        <p className="product-description">{product.description}</p>

                        <div className="d-flex align-items-center gap-3 mt-4">
                            <InputGroup style={{ maxWidth: '140px' }}>
                                <InputGroup.Text>Qty</InputGroup.Text>
                                <FormControl
                                    type="number"
                                    min="1"
                                    value={quantity}
                                    onChange={handleQuantityChange}
                                />
                            </InputGroup>
                        </div>

                        <div className="d-flex flex-column flex-md-row gap-3 mt-4">
                            <Button
                                variant="outline-primary custom-btn flex-fill"
                                onClick={() => addToWishlist(product.id)}
                                disabled={isInWishlist}
                            >
                                <FaHeart className="me-2 custom-icon" />
                                {isInWishlist ? 'In Wishlist' : 'Add to Wishlist'}
                            </Button>

                            <Button
                                variant={isInCart ? 'secondary custom-btn flex-fill' : 'success custom-btn flex-fill'}
                                onClick={() => addToCart(product.id, quantity)}
                                disabled={isInCart}
                            >
                                <FaShoppingCart className="me-2 custom-icon" />
                                {isInCart ? 'In Cart' : 'Add to Cart'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="reviews-section mt-5">
            <h3 className="section-title">⭐ Customer Reviews</h3>
            {product.reviews?.length === 0 ? (
            <p>No reviews yet.</p>
            ) : (
            <div className="list-group">
                {product.reviews?.map((review) => (
                    <div key={review.id} className="list-group-item review-item shadow-sm rounded-3 mb-3">
                        <div className="d-flex justify-content-between">
                            <h5 className="mb-1">{review.user}</h5>
                            <span className="text-warning">{'★'.repeat(review.rating)}</span>
                        </div>
                        <p className="mb-1">{review.comment}</p>
                        <small className="text-gray">{new Date(review.created_at).toLocaleDateString()}</small>
                    </div>
                ))}
            </div>
            )}
        </div>

        <div className="submit-review mt-5">
            <h4 className="section-title">Write a Review</h4>
            <form onSubmit={handleReviewSubmit} className="review-form">
                <div className="mb-3">
                    <label htmlFor="rating" className="form-label">Rating:</label>
                    <select
                        id="rating"
                        name="rating"
                        value={reviewData.rating}
                        onChange={handleReviewChange}
                        className="form-select"
                        required
                    >
                        {[5, 4, 3, 2, 1].map((star) => (
                            <option key={star} value={star}>{star} Star{star > 1 && 's'}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor="comment" className="form-label">Comment:</label>
                    <textarea
                        id="comment"
                        name="comment"
                        value={reviewData.comment}
                        onChange={handleReviewChange}
                        className="form-control"
                        rows="3"
                        required
                    />
                </div>
                <button type="submit" className="btn btn-success text-light  custom-btn" disabled={submitting}>
                    {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
            </form>
        </div>


        <div className="related-products mt-5">
            <h3 className="section-title">You May Also Like</h3>
            <div className="row">
                {relatedProducts.map((item) => (
                    <div key={item.id} className="col-6 col-md-3 mb-4">
                        <div className="card shadow-sm h-100 rounded-4">
                            {item.image ? (
                                <img
                                    src={`http://localhost:8000${item.image}`}
                                    className="card-img-top related-img rounded-top-4"
                                    alt={item.name}
                                />
                            ) : (
                                <div className="no-image-placeholder d-flex justify-content-center align-items-center rounded-top-4">
                                    No Image
                                </div>
                            )}
                            <div className="card-body text-center d-flex flex-column">
                                <h5 className="card-title">{item.name}</h5>
                                <p className="card-text text-muted">${item.price}</p>
                                <Button
                                    variant="outline-primary custom-btn mt-auto"
                                    href={`/products/${item.id}`}
                                >
                                    View Product
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>


        </div>

        
    );
};

export default ProductDetailPage;

