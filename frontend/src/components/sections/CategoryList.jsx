import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../services/axiosInstance';
import './CategoryList.css';

function CategoryList() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axiosInstance.get('categories/')
      .then(res => setCategories(res.data))
      .catch(err => console.error('Failed to fetch categories:', err));
  }, []);

  return (
    <section className="section-padding category-section" data-aos="fade-up">
      <div className="section-title-wrapper">
        <span className="section-subtitle">Exquisite Collections</span>
        <h2 className="section-title">Shop by Category</h2>
      </div>
      
      <div className="category-scroll-container">
        <div className="category-scroll">
          {categories.map(category => (
            <Link key={category.id} to={`/category/${category.id}`} className='category-link'>
              <div className="luxury-category-card">
                <div className="category-image-wrapper">
                  <img src={category.image} alt={category.name} loading="lazy" />
                  <div className="category-overlay">
                    <span className="view-collection">Explore</span>
                  </div>
                </div>
                <div className="category-name-wrapper">
                  <h3 className="category-name">{category.name}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CategoryList;
