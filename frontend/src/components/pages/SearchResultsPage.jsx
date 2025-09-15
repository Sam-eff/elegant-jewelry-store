import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const SearchResultsPage = () => {
  const [products, setProducts] = useState([]);
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get('query');

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/products/?search=${query}`);
        setProducts(response.data);
      } catch (err) {
        console.error('Error fetching search results:', err);
      }
    };

    if (query) {
      fetchSearchResults();
    }
  }, [query]);

  return (
    <div className="container mt-4">
      <h2>Search results for "{query}"</h2>

      <div className="row">
        {products.length === 0 && <p>No products found.</p>}
        {products.map(product => (
          <div key={product.id} className="col-md-3 mb-4">
            <div className="card h-100">
              {product.image ? (
                <img src={product.image} className="card-img-top" alt={product.name} />
              ) : (
                <div className="no-image text-center py-5">No Image</div>
              )}
              <div className="card-body">
                <h5>{product.name}</h5>
                <p>${product.price}</p>
                <a href={`/products/${product.id}`} className="btn btn-outline-primary">View</a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchResultsPage;
