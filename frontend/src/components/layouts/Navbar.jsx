import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaShoppingBag, FaHeart, FaUser, FaBars, FaSearch, FaTimes } from 'react-icons/fa';
import './Navbar.css';
import Wishlist from '../pages/Wishlist';
import { useAuthStore } from '../auth/useAuthStore';
import CartPage from '../pages/CartPage';

function Navbar({ darkMode, toggleDarkMode }) {
  const [showSidebar, setShowSidebar] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [activeOverlay, setActiveOverlay] = useState('');
  const { user, isLoggedIn, fetchUser, logout, error } = useAuthStore();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  
  const navigate = useNavigate();

//   console.log("User from Zustand:", user);


  useEffect(() => {
        fetchUser();
    }, [fetchUser]);
    
  
  // fetch suggestions whenever query changes
    useEffect(() => {
      const fetchSuggestions = async () => {
      if (query.trim() === '') {
        setSuggestions([]);
        return;
      }

      try {
        const response = await axios.get(`http://localhost:8000/api/products/?search=${query}`);
        setSuggestions(response.data);
      } catch (err) {
        console.error('Error fetching suggestions:', err);
      }
    };

    const delayDebounce = setTimeout(fetchSuggestions, 300); // debounce

    return () => clearTimeout(delayDebounce);
  }, [query]);

    const handleSearch = (e) => {
      e.preventDefault();
      if (query.trim() !== '') {
        navigate(`/search?query=${encodeURIComponent(query)}`);
        setShowDropdown(false);
      }
    };

    useEffect(() => {
      console.log("Suggestions updated:", suggestions);
    }, [suggestions]);
    

    const handleSuggestionClick = (productId) => {
      navigate(`/products/${productId}`);
      setQuery('');
      setShowDropdown(false);
    };

  const location = useLocation();
  const isOnWishlistPage = location.pathname === '/wishlist';
  const isOnCartPage = location.pathname === '/cart';

  const [isScrolled, setIsScrolled] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');  // optional: redirect home
    };

  

    useEffect(() => {

    const handleScroll = () => {
        setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
    }, []);

  const handleMouseEnter = (overlay) => setActiveOverlay(overlay);
  const handleMouseLeave = () => setActiveOverlay('');

  return (
    <div className={`navbar ${darkMode ? 'dark' : ''}`}>
      {/* Top Navbar */}
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        {/* Left (Search or Hamburger) */}
        <div className="navbar-left">
          <div className="desktop-search">
            <button className="icon-btn" onClick={() => setShowSearch(true)}>
              <FaSearch />
            </button>
          </div>
          <div className="mobile-menu">
            <button className="icon-btn" onClick={() => setShowSidebar(true)}>
              <FaBars />
            </button>
          </div>
        </div>

        {/* Center (Logo) */}
        <div className="navbar-center">
          <Link to="/" className="logo">Elegant Jewelry</Link>
        </div>

        {/* Right (Icons horizontally) */}
        <div className="navbar-right">
          <div 
            className="icon-container" 
            onMouseEnter={() => !isOnWishlistPage && handleMouseEnter('wishlist')} 
            onMouseLeave={() => !isOnWishlistPage && handleMouseLeave()}
          >
            <button className="icon-btn"><FaHeart /></button>
            {activeOverlay === 'wishlist' && !isOnWishlistPage && (
            <div className="overlay">
                <Wishlist compact />
                <button className='link-btn'><Link to="/wishlist">View Wishlist</Link></button>
            </div>
            )}

          </div>

          <div
              className="icon-container"
              onMouseEnter={() => !isOnCartPage && handleMouseEnter('cart')}
              onMouseLeave={() => !isOnCartPage && handleMouseLeave()}
              >
              <button className="icon-btn"><FaShoppingBag /></button>
              {activeOverlay === 'cart' && !isOnCartPage && (
                <div className="overlay">
                  <CartPage compact />
                  <button className="link-btn"><Link to="/cart">View Cart</Link></button>
                  <button className="link-btn"><Link to="/checkout">Checkout</Link></button>
                </div>
              )}
            </div>


          <div 
            className="icon-container" 
            onMouseEnter={() => handleMouseEnter('user')} 
            onMouseLeave={handleMouseLeave}
            >
            <button className="icon-btn"><FaUser /></button>
            {activeOverlay === 'user' && (
            <div className="overlay">
                {isLoggedIn ? (
                <>
                {console.log("user in overlay:", user)}
                    {user?.avatar ? (
                    <img 
                        src={user.avatar}
                        alt="avatar" 
                        style={{ width: '40px', height: '50px', borderRadius: '50%', marginBottom: '0.5rem' }} 
                    />
                    ) : (
                        <div style={{ width: '40px', height: '40px', backgroundColor: '#ccc', borderRadius: '50%', marginBottom: '0.5rem', display: 'inline-block' }}></div>
                    )}
                    {user && <p>Welcome, {user.username}!</p>}
                    <Link to="/profile" className='auth'>View Profile</Link><br />
                    <button onClick={handleLogout} className='logout-btn'>Logout</button>
                </>
                ) : (
                <>
                    <Link to="/login" className='auth'>Login</Link><br />
                    <hr />
                    <Link to="/signup" className='auth'>Create Account</Link>
                </>
                )}
            </div>
        )}


          </div>
          <button onClick={toggleDarkMode} className="mode-toggle">
        {darkMode ? '☀️ Light' : '🌙 Dark'}
      </button>

        </div>
      </nav>

      {/* Second Navbar (desktop links) */}
      <div className="second-navbar">
        <Link to="/">Home</Link>
        <Link to="/products">Products</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
      </div>

      {/* Mobile Search Bar */}
        <div className="mobile-search-bar">
            <form onSubmit={handleSearch} className='d-flex'>
            <input 
                type="text" 
                placeholder="Search for jewelry..." 
                className="mobile-search-input"
                value={query} 
                onChange={(e) => { setQuery(e.target.value);
                setShowDropdown(true);
                }}
                onBlur={() => setTimeout(() => setShowDropdown(false), 200)} // allow click before closing
                onFocus={() => query && setShowDropdown(true)}
                autoFocus
            />
            {showDropdown && suggestions.length > 0 && (
            <ul className="list-group position-absolute" style={{ top: '100%', zIndex: 1000, width: '100%' }}>
              {suggestions.slice(0, 5).map(product => (
                <li
                  key={product.id}
                  className="list-group-item list-group-item-action"
                  onMouseDown={() => handleSuggestionClick(product.id)} // use onMouseDown to fire before blur
                >
                  {product.name}
                </li>
              ))}
            </ul>
          )}
            <button className="search-btn" type="submit"><FaSearch /></button>
            </form>
        </div>

      {/* Mobile Sidebar */}
      {showSidebar && (
        <div className="mobile-sidebar">
          <button className="close-btn" onClick={() => setShowSidebar(false)}><FaTimes /></button>
          <nav className="sidebar-nav">
            <Link to="/" onClick={() => setShowSidebar(false)}>Home</Link>
            <Link to="/products" onClick={() => setShowSidebar(false)}>Products</Link>
            <Link to="/about" onClick={() => setShowSidebar(false)}>About</Link>
            <Link to="/contact" onClick={() => setShowSidebar(false)}>Contact</Link>
            <hr />
            <Link to="/login" onClick={() => setShowSidebar(false)}>Login</Link>
            <Link to="/signup" onClick={() => setShowSidebar(false)}>Create Account</Link>
          </nav>
        </div>
      )}

      {/* Search Overlay */}
      {showSearch && (
        <div className="search-overlay">
          <div className="search-bar">
          <form className="d-flex ms-auto" onSubmit={handleSearch}>
          <input
            type="text"
            className="product-search-input"
            placeholder="Search products..."
            value={query}
            onChange={(e) => { setQuery(e.target.value);
              setShowDropdown(true);
              }}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)} // allow click before closing
            onFocus={() => query && setShowDropdown(true)}
            autoFocus
          />
          {showDropdown && suggestions.length > 0 && (
            <ul className="list-group position-absolute" style={{ top: '100%', zIndex: 1000, width: '100%' }}>
              {suggestions.slice(0, 5).map(product => (
                <li
                  key={product.id}
                  className="list-group-item list-group-item-action"
                  onMouseDown={() => handleSuggestionClick(product.id)} // use onMouseDown to fire before blur
                >
                  {product.name}
                </li>
              ))}
            </ul>
          )}
          <button className="btn" type="submit"><FaSearch /></button>
        </form>
            <button className="close-btn" onClick={() => setShowSearch(false)}>
              <FaTimes />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Navbar;












