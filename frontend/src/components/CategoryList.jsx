import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './CategoryList.css';


function CategoryList() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8000/api/categories/')
      .then(res => setCategories(res.data))
      .catch(err => console.error('Failed to fetch categories:', err));
  }, []);

  return (
    <section className="category-section" data-aos="zoom-in-up">
      <h2 className="category-title">Shop by Category</h2>
      <div className="category-scroll">
        {categories.map(category => (
          <Link to={`/category/${category.id}`} className='link text-decoration-none'>
          <div className="category-card" key={category.id}>
            <img src={category.image} alt={category.name} />
            <div className="category-name">{category.name}</div>
          </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default CategoryList;

