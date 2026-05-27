import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaShoppingCart, FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { useWishlistStore } from '../store/useWishlistStore';
import { useCartStore } from '../store/useCartStore';
import axiosInstance from '../services/axiosInstance';
import { toast } from 'react-toastify';
import ProductCard from '../components/common/ProductCard';
import './ProductDetailPage.css';

const ProductDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });
    const [submitting, setSubmitting] = useState(false);

    const { wishlist, addToWishlist, removeFromWishlist, loading: wishlistLoading } = useWishlistStore();
    const { cart, addToCart, loading: cartLoading } = useCartStore();

    useEffect(() => {
        setLoading(true);
        fetchProduct();
        fetchRelated();
    }, [id]);

    const fetchProduct = async () => {
        try {
            const response = await axiosInstance.get(`products/${id}/`);
            setProduct(response.data);
        } catch (err) {
            console.error(err);
            setError('Failed to load product details.');
        } finally {
            setLoading(false);
        }
    };

    const fetchRelated = async () => {
        try {
            const response = await axiosInstance.get(`products/${id}/related/`);
            setRelatedProducts(response.data);
        } catch (err) {
            console.error('Failed to load related products:', err);
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
            await axiosInstance.post(`products/${id}/reviews/`, reviewData);
            setReviewData({ rating: 5, comment: '' });
            await fetchProduct(); // Refresh reviews and rating
            toast.success('Thank you! Your review has been submitted.');
        } catch (err) {
            console.error(err);
            if (err.response && err.response.status === 400) {
                toast.error(err.response.data.detail || 'You have already reviewed this product.');
            } else {
                toast.error('Failed to submit review.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleQuantityChange = (e) => {
        const value = Math.max(1, parseInt(e.target.value) || 1);
        setQuantity(value);
    };

    if (loading) {
        return (
            <div className="product-detail-loading">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="product-detail-error container section-padding">
                <div className="luxury-error-card">
                    <h2>Creation Not Found</h2>
                    <p>{error || 'The requested jewelry item could not be retrieved.'}</p>
                    <button className="btn-luxury btn-luxury-solid mt-4" onClick={() => navigate('/products')}>
                        Back to Gallery
                    </button>
                </div>
            </div>
        );
    }

    const isInWishlist = wishlist.some(item => item?.product?.id === product.id);
    const isInCart = cart.some(item => item?.product?.id === product.id);
    const wishlistItem = wishlist.find(item => item?.product?.id === product.id);
    const wishlistItemId = wishlistItem?.id;

    // Render Star helper
    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars.push(<FaStar key={i} className="star-filled" />);
            } else if (i - 0.5 <= rating) {
                stars.push(<FaStarHalfAlt key={i} className="star-filled" />);
            } else {
                stars.push(<FaRegStar key={i} className="star-empty" />);
            }
        }
        return stars;
    };

    // Calculate average rating
    const avgRating = product.reviews?.length 
        ? (product.reviews.reduce((acc, rev) => acc + rev.rating, 0) / product.reviews.length).toFixed(1)
        : null;

    return (
        <div className="product-detail-page section-padding">
            <div className="product-detail-container">
                <div className="product-detail-grid">
                    {/* Left Column: Image Gallery */}
                    <div className="product-gallery" data-aos="fade-right">
                        <div className="main-image-wrapper">
                            {product.image ? (
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="main-image"
                                />
                            ) : (
                                <div className="detail-placeholder">
                                    <span>Exquisite Design</span>
                                </div>
                            )}
                            {product.is_featured && <span className="detail-tag">Featured</span>}
                        </div>
                    </div>

                    {/* Right Column: Information */}
                    <div className="product-info-panel" data-aos="fade-left">
                        <span className="info-collection">Fine Jewelry</span>
                        <h1 className="detail-title">{product.name}</h1>
                        
                        {avgRating && (
                            <div className="detail-rating-summary">
                                <div className="stars-wrapper">{renderStars(parseFloat(avgRating))}</div>
                                <span className="rating-text">({avgRating} out of 5 based on {product.reviews.length} reviews)</span>
                            </div>
                        )}
                        
                        <div className="detail-price-box">
                            <span className="detail-price">
                                ${parseFloat(product.price).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </span>
                        </div>

                        <div className="detail-divider"></div>

                        <p className="detail-description">{product.description}</p>

                        <div className="detail-divider"></div>

                        {/* Order & Selection Section */}
                        <div className="detail-order-actions">
                            <div className="quantity-selector">
                                <label htmlFor="qty">Quantity</label>
                                <div className="qty-control">
                                    <button 
                                        onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                                        disabled={quantity <= 1 || isInCart}
                                    >-</button>
                                    <input 
                                        id="qty" 
                                        type="number" 
                                        value={quantity} 
                                        onChange={handleQuantityChange}
                                        disabled={isInCart}
                                    />
                                    <button 
                                        onClick={() => setQuantity(prev => prev + 1)}
                                        disabled={isInCart}
                                    >+</button>
                                </div>
                            </div>

                            <div className="actions-buttons">
                                <button
                                    className={`btn-luxury flex-fill ${isInCart ? 'btn-luxury-solid' : 'btn-luxury-solid'}`}
                                    onClick={() => !isInCart && addToCart(product.id, quantity, navigate)}
                                    disabled={cartLoading || isInCart}
                                >
                                    <FaShoppingCart className="me-2" />
                                    {isInCart ? 'Already In Cart' : 'Add to Collection'}
                                </button>

                                <button
                                    className={`btn-luxury ${isInWishlist ? 'active' : ''}`}
                                    onClick={() => {
                                        if (isInWishlist && wishlistItemId) {
                                            removeFromWishlist(wishlistItemId);
                                        } else {
                                            addToWishlist(product.id, navigate);
                                        }
                                    }}
                                    disabled={wishlistLoading}
                                    title={isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
                                >
                                    {isInWishlist ? <FaHeart className="wishlist-icon active" /> : <FaRegHeart className="wishlist-icon" />}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Section: Reviews */}
                <div className="product-reviews-section" data-aos="fade-up">
                    <div className="reviews-layout">
                        {/* Reviews List */}
                        <div className="reviews-list-container">
                            <h3 className="section-title">Client Reviews</h3>
                            {product.reviews?.length === 0 ? (
                                <p className="no-reviews-msg">No client evaluations yet. Be the first to share your experience.</p>
                            ) : (
                                <div className="reviews-list">
                                    {product.reviews?.map((review) => (
                                        <div key={review.id} className="luxury-review-card">
                                            <div className="review-header">
                                                <h4 className="reviewer-name">{review.user}</h4>
                                                <div className="reviewer-stars">{renderStars(review.rating)}</div>
                                            </div>
                                            <p className="review-comment">{review.comment}</p>
                                            <span className="review-date">
                                                {new Date(review.created_at).toLocaleDateString(undefined, { 
                                                    year: 'numeric', 
                                                    month: 'long', 
                                                    day: 'numeric' 
                                                })}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Review Form */}
                        <div className="review-form-container">
                            <div className="luxury-review-box glass-card">
                                <h3 className="section-title">Submit Review</h3>
                                <form onSubmit={handleReviewSubmit} className="luxury-review-form">
                                    <div className="form-group mb-4">
                                        <label htmlFor="rating" className="luxury-label">Rating</label>
                                        <select
                                            id="rating"
                                            name="rating"
                                            value={reviewData.rating}
                                            onChange={handleReviewChange}
                                            className="luxury-input"
                                            required
                                        >
                                            {[5, 4, 3, 2, 1].map((star) => (
                                                <option key={star} value={star}>
                                                    {star} Star{star > 1 ? 's' : ''}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group mb-4">
                                        <label htmlFor="comment" className="luxury-label">Comments</label>
                                        <textarea
                                            id="comment"
                                            name="comment"
                                            value={reviewData.comment}
                                            onChange={handleReviewChange}
                                            className="luxury-input"
                                            rows="4"
                                            placeholder="Share your thoughts on this creation..."
                                            required
                                        />
                                    </div>
                                    <button 
                                        type="submit" 
                                        className="btn-luxury btn-luxury-solid w-100" 
                                        disabled={submitting}
                                    >
                                        {submitting ? 'Submitting...' : 'Post Evaluation'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Products Grid */}
                {relatedProducts.length > 0 && (
                    <div className="related-creations-section" data-aos="fade-up">
                        <div className="section-title-wrapper">
                            <span className="section-subtitle">Exquisite Pairings</span>
                            <h2 className="section-title">You May Also Like</h2>
                        </div>
                        <div className="related-grid">
                            {relatedProducts.slice(0, 4).map((item) => (
                                <ProductCard key={item.id} product={item} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductDetailPage;
