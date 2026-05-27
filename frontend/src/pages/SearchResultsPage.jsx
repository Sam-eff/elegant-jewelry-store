import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaChevronLeft } from 'react-icons/fa';
import axiosInstance from '../services/axiosInstance';
import ProductCard from '../components/common/ProductCard';

const SearchResultsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get('query') || '';

  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get(`products/?search=${query}`);
        setProducts(response.data);
      } catch (err) {
        console.error('Error fetching search results:', err);
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchSearchResults();
    } else {
      setProducts([]);
      setLoading(false);
    }
  }, [query]);

  if (loading) {
    return (
      <div className="products-page-loading">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Searching catalog...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="products-catalog-page section-padding">
      <div className="catalog-container">
        
        <button className="back-to-cart-btn" onClick={() => navigate('/products')}>
          <FaChevronLeft className="me-2" /> Back to Gallery
        </button>

        <div className="section-title-wrapper" data-aos="fade-up">
          <span className="section-subtitle">Search Results</span>
          <h2 className="section-title">Acquisition Query</h2>
          <p className="catalog-intro-text">
            Results matching your query "{query}" within our exclusive vault.
          </p>
        </div>

        {products.length === 0 ? (
          <div className="empty-catalog-results" data-aos="fade-up">
            <h3>No Creations Found</h3>
            <p>We could not find any creations matching your search query "{query}". Please verify the spelling or browse our collection.</p>
            <button className="btn-luxury btn-luxury-solid mt-3" onClick={() => navigate('/products')}>
              Discover All Creations
            </button>
          </div>
        ) : (
          <div className="catalog-products-grid" data-aos="fade-up">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResultsPage;
