import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Spinner, Alert } from 'react-bootstrap';
import ProductCard from '../ProductCard';

const CategoryProducts = () => {
    const { id } = useParams();
    const [products, setProducts] = useState([]);
    const [categoryName, setCategoryName] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCategoryProducts();
    }, [id]);

    const fetchCategoryProducts = async () => {
        try {
            const res = await axios.get(`http://localhost:8000/api/categories/${id}/products/`);
            setProducts(res.data.products);
            setCategoryName(res.data.category_name);
        } catch (err) {
            console.error(err);
            setError('Failed to load products.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Spinner animation="border" />;
    if (error) return <Alert variant="danger">{error}</Alert>;

    return (
        <div className="container mt-5">
            <h2>Category: {categoryName}</h2>
            <div className="row mt-5">
                {products.map(product => (
                    <div key={product.id} className="col-6 col-md-3 mb-4">
                        <ProductCard product={product} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CategoryProducts;

