import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCartStore } from './useCartStore';
import { Spinner } from 'react-bootstrap';
import './CartPage.css';  // 🔗 Import your custom styles

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

    const navigate = useNavigate()

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    const handleIncrease = (productId) => {
        addToCart(productId, 1);
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
            <div className="compact-cart">
                <h2>Your Cart</h2>
                {cart.length === 0 ? (
                    <p>Your cart is empty.</p>
                ) : (
                    <ul>
                        {cart.slice(0, 3).map(item => (
                            <li key={item.id} className="compact-cart-item">
                                <Link to={`/products/${item.id}`}        className="text-decoration-none link">
                                {item.product.image ? (
                                    <img
                                        src={`http://localhost:8000${item.product.image}`}
                                        alt={item.product.name}
                                        className="compact-cart-item-image"
                                    />
                                ) : (
                                    <div className="compact-no-image">No Image</div>
                                )}
                                <div className="compact-cart-item-info">
                                    <span>{item.product.name}</span>
                                    <span>x {item.quantity}</span>
                                </div>
                                </Link>
                            </li>
                        ))}
                        {cart.length > 3 && <p>...and more</p>}
                    </ul>
                )}
            </div>
        );
    }
    

    return (
        <div className="container mt-5 cart-container">
            <h2 className="cart-title">🛒 Your Cart</h2>

            {loading && (
                <div className="text-center">
                    <Spinner animation="border" />
                </div>
            )}

            {error && <div className="alert alert-danger">{error}</div>}

            {!loading && cart.length === 0 && (
                <div className="alert alert-info text-center">
                    Your cart is empty.
                </div>
            )}

            {!loading && cart.length > 0 && (
                <>
                    <ul className="list-group mb-3">
                        {cart.map(item => (
                            <li
                                key={item.id}
                                className="list-group-item d-flex justify-content-between align-items-center cart-item"
                            >
                                <div className="d-flex align-items-center">
                                    {item.product.image ? (
                                        <img
                                            src={`http://localhost:8000${item.product.image}`}
                                            alt={item.product.name}
                                            className="cart-item-image me-3"
                                        />
                                    ) : (
                                        <div className="no-image-placeholder me-3">
                                            No Image
                                        </div>
                                    )}
                                    <div className="cart-item-details">
                                        <h5>{item.product.name}</h5>
                                        <p>Price: ${Number(item.product.price).toFixed(2)}</p>
                                        <p>Quantity: {item.quantity}</p>
                                        <div className="btn-group" role="group">
                                            <button
                                                className="btn btn-sm btn-outline-secondary"
                                                onClick={() => handleDecrease(item)}
                                                disabled={loading}
                                            >
                                                -
                                            </button>
                                            <button
                                                className="btn btn-sm btn-outline-secondary"
                                                onClick={() => handleIncrease(item.product.id)}
                                                disabled={loading}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => removeFromCart(item.id)}
                                >
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ul>

                    <div className="total-box">
                        <h4>Total: ${total.toFixed(2)}</h4>
                        <button
                            className="btn btn-warning"
                            onClick={clearCart}
                        >
                            Clear Cart
                        </button>
                        <Link to="/checkout">Proceed to Checkout</Link>
                    </div>
                </>
            )}
        </div>
    );
};

export default CartPage;


