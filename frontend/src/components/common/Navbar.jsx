import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import axios from '../../services/axiosInstance';
import { FaShoppingBag, FaHeart, FaUser, FaBars, FaSearch, FaTimes } from 'react-icons/fa';
import './Navbar.css';
import { useAuthStore } from '../../store/useAuthStore';
import { useCartStore } from '../../store/useCartStore';
import { useWishlistStore } from '../../store/useWishlistStore';

function Navbar() {
  const [showSidebar, setShowSidebar] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [activeOverlay, setActiveOverlay] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const { user, isLoggedIn, fetchUser, logout } = useAuthStore();
  const { cart, fetchCart } = useCartStore();
  const { wishlist, fetchWishlist } = useWishlistStore();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const overlayTimerRef = useRef(null);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    if (isLoggedIn) {
      fetchCart();
      fetchWishlist();
    }
  }, [isLoggedIn, fetchCart, fetchWishlist]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.trim() === '') { setSuggestions([]); return; }
      try {
        const res = await axios.get(`products/?search=${query}`);
        setSuggestions(res.data);
      } catch (err) {
        console.error('Error fetching suggestions:', err);
      }
    };
    const timer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?query=${encodeURIComponent(query)}`);
      setShowDropdown(false);
      setShowSearch(false);
      setQuery('');
    }
  };

  const handleSuggestionClick = (id) => {
    navigate(`/products/${id}`);
    setQuery('');
    setShowDropdown(false);
    setShowSearch(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleMouseEnter = (overlay) => {
    clearTimeout(overlayTimerRef.current);
    setActiveOverlay(overlay);
  };

  const handleMouseLeave = () => {
    overlayTimerRef.current = setTimeout(() => setActiveOverlay(''), 150);
  };

  return (
    <div className={`navbar-wrapper ${scrolled ? 'scrolled' : ''}`}>
      <nav className="navbar-inner">

        {/* ── Logo ── */}
        <Link to="/" className="nav-logo">ELEGANT</Link>

        {/* ── Desktop nav links ── */}
        <ul className="nav-links">
          <li><NavLink to="/" end>Home</NavLink></li>
          <li><NavLink to="/products">Collections</NavLink></li>
          <li><NavLink to="/about">About Us</NavLink></li>
          <li><NavLink to="/contact">Contact</NavLink></li>
        </ul>

        {/* ── Right icons ── */}
        <div className="nav-icons">

          {/* Search */}
          <button className="nav-icon-btn" aria-label="Search" onClick={() => setShowSearch(true)}>
            <FaSearch />
          </button>

          {/* Wishlist */}
          <div className="nav-icon-wrap"
            onMouseEnter={() => handleMouseEnter('wishlist')}
            onMouseLeave={handleMouseLeave}
          >
            <Link to="/wishlist" className="nav-icon-btn" aria-label="Wishlist">
              <FaHeart />
              {isLoggedIn && wishlist.length > 0 && (
                <span className="nav-badge">{wishlist.length}</span>
              )}
            </Link>
          </div>

          {/* Cart */}
          <div className="nav-icon-wrap"
            onMouseEnter={() => handleMouseEnter('cart')}
            onMouseLeave={handleMouseLeave}
          >
            <Link to="/cart" className="nav-icon-btn" aria-label="Cart">
              <FaShoppingBag />
              {isLoggedIn && cart.length > 0 && (
                <span className="nav-badge">{cart.length}</span>
              )}
            </Link>
          </div>

          {/* Account */}
          <div className="nav-icon-wrap"
            onMouseEnter={() => handleMouseEnter('user')}
            onMouseLeave={handleMouseLeave}
          >
            <button className="nav-icon-btn" aria-label="Account">
              {isLoggedIn && user?.avatar
                ? <img src={user.avatar} alt="Avatar" className="nav-avatar" />
                : <FaUser />
              }
            </button>

            {activeOverlay === 'user' && (
              <div className="nav-dropdown"
                onMouseEnter={() => handleMouseEnter('user')}
                onMouseLeave={handleMouseLeave}
              >
                {isLoggedIn ? (
                  <>
                    <p className="dropdown-greeting">Welcome, <strong>{user?.username}</strong></p>
                    <Link to="/profile" className="dropdown-link" onClick={() => setActiveOverlay('')}>View Profile</Link>
                    <Link to="/my-orders" className="dropdown-link" onClick={() => setActiveOverlay('')}>My Orders</Link>
                    <button className="dropdown-logout" onClick={handleLogout}>Logout</button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="dropdown-link">Sign In</Link>
                    <div className="dropdown-divider" />
                    <Link to="/signup" className="dropdown-link">Create Account</Link>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Hamburger — mobile only */}
          <button className="nav-icon-btn hamburger" aria-label="Menu" onClick={() => setShowSidebar(true)}>
            <FaBars />
          </button>
        </div>
      </nav>

      {/* ── Full-screen search overlay ── */}
      {showSearch && (
        <div className="search-overlay">
          <button className="search-close" onClick={() => { setShowSearch(false); setQuery(''); }}>
            <FaTimes />
          </button>
          <form className="search-form" onSubmit={handleSearch}>
            <input
              type="text"
              className="search-input"
              placeholder="Search collections…"
              value={query}
              autoFocus
              onChange={(e) => { setQuery(e.target.value); setShowDropdown(true); }}
              onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
              onFocus={() => query && setShowDropdown(true)}
            />
            <button type="submit" className="search-submit"><FaSearch /></button>
          </form>
          {showDropdown && suggestions.length > 0 && (
            <ul className="search-suggestions">
              {suggestions.slice(0, 6).map(p => (
                <li key={p.id} onMouseDown={() => handleSuggestionClick(p.id)}>{p.name}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* ── Mobile sidebar ── */}
      {showSidebar && (
        <>
          <div className="sidebar-backdrop" onClick={() => setShowSidebar(false)} />
          <aside className="mobile-sidebar">
            <button className="sidebar-close" onClick={() => setShowSidebar(false)}><FaTimes /></button>
            <Link to="/" className="nav-logo sidebar-logo">ELEGANT</Link>
            <nav className="sidebar-nav">
              <NavLink to="/" end onClick={() => setShowSidebar(false)}>Home</NavLink>
              <NavLink to="/products" onClick={() => setShowSidebar(false)}>Collections</NavLink>
              <NavLink to="/about" onClick={() => setShowSidebar(false)}>About Us</NavLink>
              <NavLink to="/contact" onClick={() => setShowSidebar(false)}>Contact</NavLink>
              <div className="sidebar-divider" />
              {isLoggedIn ? (
                <>
                  <Link to="/profile" onClick={() => setShowSidebar(false)}>Profile</Link>
                  <Link to="/my-orders" onClick={() => setShowSidebar(false)}>My Orders</Link>
                  <span className="sidebar-logout" onClick={() => { handleLogout(); setShowSidebar(false); }}>Logout</span>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setShowSidebar(false)}>Sign In</Link>
                  <Link to="/signup" onClick={() => setShowSidebar(false)}>Create Account</Link>
                </>
              )}
            </nav>
          </aside>
        </>
      )}
    </div>
  );
}

export default Navbar;
