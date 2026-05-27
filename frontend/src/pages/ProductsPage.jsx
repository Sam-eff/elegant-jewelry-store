import React, { useEffect, useState } from 'react';
import { FaFilter, FaSearch, FaSortAmountDown } from 'react-icons/fa';
import axiosInstance from '../services/axiosInstance';
import ProductCard from '../components/common/ProductCard';
import './ProductsPage.css';

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filtering / Sorting State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortOrder, setSortOrder] = useState('featured'); // 'featured', 'price-asc', 'price-desc'

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          axiosInstance.get('products/'),
          axiosInstance.get('categories/')
        ]);
        setProducts(productsRes.data);
        setCategories(categoriesRes.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load exclusive creations. Please refresh.');
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Filtered and Sorted Products
  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            product.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === '' || product.category?.id === Number(selectedCategory) || product.category === Number(selectedCategory);
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortOrder === 'price-asc') {
        return parseFloat(a.price) - parseFloat(b.price);
      }
      if (sortOrder === 'price-desc') {
        return parseFloat(b.price) - parseFloat(a.price);
      }
      // Featured or Default: no sort override
      return 0;
    });

  if (loading) {
    return (
      <div className="products-page-loading">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading creations...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="products-catalog-page section-padding">
      <div className="catalog-container">
        
        {/* Page Header */}
        <div className="section-title-wrapper" data-aos="fade-up">
          <span className="section-subtitle">Fine Creations</span>
          <h2 className="section-title">The Complete Collection</h2>
          <p className="catalog-intro-text">
            Discover bespoke precious designs handcrafting timeless elegance.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="catalog-filter-bar glass-card" data-aos="fade-up">
          {/* Search */}
          <div className="filter-item-search">
            <FaSearch className="filter-icon" />
            <input 
              type="text" 
              placeholder="Search precious creations..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="filter-search-input"
            />
          </div>

          {/* Category Select */}
          <div className="filter-item">
            <FaFilter className="filter-icon" />
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="filter-select"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Sort Select */}
          <div className="filter-item">
            <FaSortAmountDown className="filter-icon" />
            <select 
              value={sortOrder} 
              onChange={(e) => setSortOrder(e.target.value)}
              className="filter-select"
            >
              <option value="featured">Sort: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Error Banner */}
        {error && <div className="luxury-alert-error my-4">{error}</div>}

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="empty-catalog-results" data-aos="fade-up">
            <h3>No Creations Found</h3>
            <p>We could not find any products matching your active filters. Try resetting your search query or filters.</p>
            <button 
              className="btn-luxury btn-luxury-solid mt-3"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('');
                setSortOrder('featured');
              }}
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="catalog-products-grid" data-aos="fade-up">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductsPage;
