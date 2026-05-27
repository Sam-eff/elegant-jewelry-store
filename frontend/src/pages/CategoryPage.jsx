import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaChevronLeft } from 'react-icons/fa';
import axiosInstance from '../services/axiosInstance';
import ProductCard from '../components/common/ProductCard';

const CategoryProducts = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [categoryName, setCategoryName] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategoryProducts = async () => {
            try {
                const res = await axiosInstance.get(`categories/${id}/products/`);
                setProducts(res.data.products);
                setCategoryName(res.data.category_name);
            } catch (err) {
                console.error(err);
                setError('We were unable to load selections for this category.');
            } finally {
                setLoading(false);
            }
        };

        fetchCategoryProducts();
    }, [id]);

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
                
                <button className="back-to-cart-btn" onClick={() => navigate('/')}>
                    <FaChevronLeft className="me-2" /> Back to Collections
                </button>

                <div className="section-title-wrapper" data-aos="fade-up">
                    <span className="section-subtitle">Curated Category</span>
                    <h2 className="section-title">{categoryName || 'Exclusive Selection'}</h2>
                    <p className="catalog-intro-text">
                        Discover handcrafted masterpieces specifically categorized under {categoryName}.
                    </p>
                </div>

                {error && <div className="luxury-alert-error my-4">{error}</div>}

                {products.length === 0 ? (
                    <div className="empty-catalog-results" data-aos="fade-up">
                        <h3>No Creations in Category</h3>
                        <p>We do not have any active creations listed under this category at the moment. Please explore our other categories.</p>
                        <button className="btn-luxury btn-luxury-solid mt-3" onClick={() => navigate('/products')}>
                            Explore All Creations
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

export default CategoryProducts;
