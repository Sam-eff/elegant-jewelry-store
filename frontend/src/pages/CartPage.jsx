import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaTrash, FaMinus, FaPlus, FaShoppingBag } from 'react-icons/fa';
import { useCartStore } from '../store/useCartStore';
import './CartPage.css';

const CartPage = ({ compact = false }) => {
    const {
        loading,
        error,
        cart,
        fetchCart,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart
    } = useCartStore();

    const navigate = useNavigate();

    useEffect(() => {
        fetchCart(navigate);
    }, [fetchCart]);

    const handleIncrease = (item) => {
        updateCartItem(item.id, item.quantity + 1);
    };

    const handleDecrease = (item) => {
        if (item.quantity > 1) {
            updateCartItem(item.id, item.quantity - 1);
        } else {
            removeFromCart(item.id);
        }
    };

    const total = cart.reduce((sum, item) => {
        return sum + (item.product.price ? item.product.price * item.quantity : 0);
    }, 0);

    if (compact) {
        return (
            <div className="compact-cart-panel glass-card">
                <h3 className="compact-cart-title">Your Cart</h3>
                {cart.length === 0 ? (
                    <p className="compact-cart-empty">Your cart is empty.</p>
                ) : (
                    <div className="compact-cart-items-list">
                        {cart.slice(0, 3).map(item => (
                            <div key={item.id} className="compact-cart-item-row">
                                <Link to={`/products/${item.product.id}`} className="compact-cart-item-link">
                                    <div className="compact-cart-img-wrapper">
                                        {item.product.image ? (
                                            <img
                                                src={item.product.image}
                                                alt={item.product.name}
                                                className="compact-cart-img"
                                            />
                                        ) : (
                                            <div className="compact-no-image">No Image</div>
                                        )}
                                    </div>
                                    <div className="compact-cart-meta">
                                        <span className="compact-name">{item.product.name}</span>
                                        <span className="compact-price-qty">
                                            {item.quantity} × ${Number(item.product.price).toFixed(2)}
                                        </span>
                                    </div>
                                </Link>
                            </div>
                        ))}
                        {cart.length > 3 && (
                            <div className="compact-more-items-tag">
                                ...and {cart.length - 3} more precious item(s)
                            </div>
                        )}
                        <div className="compact-total-bar">
                            <span>Total:</span>
                            <span className="compact-total-val">${total.toFixed(2)}</span>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    if (loading && cart.length === 0) {
        return (
            <div className="cart-page-loading">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page section-padding">
            <div className="cart-page-container">
                <div className="section-title-wrapper">
                    <span className="section-subtitle">Your Selections</span>
                    <h2 className="section-title">Precious Cart</h2>
                </div>

                {error && <div className="luxury-alert-error">{error}</div>}

                {cart.length === 0 ? (
                    <div className="empty-cart-view" data-aos="fade-up">
                        <div className="empty-cart-icon-box">
                            <FaShoppingBag className="empty-cart-icon" />
                        </div>
                        <h3>Your collection is empty</h3>
                        <p>Discover our beautiful collection and select items that express your luxury style.</p>
                        <button className="btn-luxury btn-luxury-solid mt-4" onClick={() => navigate('/products')}>
                            Discover Gallery
                        </button>
                    </div>
                ) : (
                    <div className="cart-main-layout" data-aos="fade-up">
                        {/* Cart Items List */}
                        <div className="cart-items-column">
                            <div className="cart-items-list-header">
                                <span>Product Detail</span>
                                <span className="text-center">Quantity</span>
                                <span className="text-end">Subtotal</span>
                            </div>

                            <div className="cart-items-list">
                                {cart.map(item => (
                                    <div key={item.id} className="luxury-cart-item">
                                        {/* Product Details */}
                                        <div className="cart-item-info-col">
                                            <div className="cart-item-img-wrapper">
                                                {item.product.image ? (
                                                    <img
                                                        src={item.product.image}
                                                        alt={item.product.name}
                                                        className="cart-item-img"
                                                    />
                                                ) : (
                                                    <div className="cart-no-image">No Image</div>
                                                )}
                                            </div>
                                            <div className="cart-item-meta">
                                                <h4 className="cart-item-title">
                                                    <Link to={`/products/${item.product.id}`}>{item.product.name}</Link>
                                                </h4>
                                                <p className="cart-item-price-each">
                                                    ${parseFloat(item.product.price).toLocaleString('en-US', { minimumFractionDigits: 2 })} each
                                                </p>
                                                <button
                                                    className="cart-item-remove-btn"
                                                    onClick={() => removeFromCart(item.id)}
                                                    title="Remove item"
                                                >
                                                    <FaTrash className="me-2" /> Remove
                                                </button>
                                            </div>
                                        </div>

                                        {/* Quantity Controls */}
                                        <div className="cart-item-qty-col">
                                            <div className="qty-control">
                                                <button
                                                    onClick={() => handleDecrease(item)}
                                                    disabled={loading}
                                                >
                                                    <FaMinus />
                                                </button>
                                                <span>{item.quantity}</span>
                                                <button
                                                    onClick={() => handleIncrease(item)}
                                                    disabled={loading}
                                                >
                                                    <FaPlus />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Item Total */}
                                        <div className="cart-item-subtotal-col text-end">
                                            <span className="cart-item-subtotal-val">
                                                ${(Number(item.product.price) * item.quantity).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="cart-actions-footer mt-4">
                                <button className="btn-luxury" onClick={() => navigate('/products')}>
                                    Continue Shopping
                                </button>
                                <button className="btn-luxury btn-luxury-clear" onClick={clearCart}>
                                    Clear Cart
                                </button>
                            </div>
                        </div>

                        {/* Order Summary Sidebar */}
                        <div className="cart-summary-column">
                            <div className="luxury-summary-card glass-card">
                                <h3 className="summary-title">Summary</h3>
                                <div className="summary-row">
                                    <span>Subtotal</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                                <div className="summary-row">
                                    <span>Shipping</span>
                                    <span className="gold-text">Complimentary</span>
                                </div>
                                <div className="summary-row">
                                    <span>Insurance</span>
                                    <span className="gold-text">Complimentary</span>
                                </div>
                                <div className="summary-divider"></div>
                                <div className="summary-total-row">
                                    <span>Total</span>
                                    <span className="summary-total-price">${total.toFixed(2)}</span>
                                </div>
                                <button
                                    className="btn-luxury btn-luxury-solid w-100 mt-4 checkout-btn"
                                    onClick={() => navigate('/checkout')}
                                >
                                    Proceed to Checkout
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartPage;
