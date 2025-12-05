// components/CategorySidebar.js
import React, { useState, useEffect } from 'react';
import { productService } from '../services/productService';

const CategorySidebar = ({ onSelectCategory, selectedCategory, onPriceFilter }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await productService.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePriceChange = (min, max) => {
    setPriceRange({ min, max });
    if (onPriceFilter) {
      onPriceFilter(min, max);
    }
  };

  if (loading) {
    return <div className="category-sidebar loading">Loading categories...</div>;
  }

  return (
    <div className="category-sidebar">
      <div className="sidebar-section">
        <h3>Categories</h3>
        <ul className="category-list">
          <li>
            <button 
              className={!selectedCategory ? 'active' : ''}
              onClick={() => onSelectCategory(null)}
            >
              All Products
            </button>
          </li>
          {categories.map(category => (
            <li key={category.id}>
              <button 
                className={selectedCategory === category.id ? 'active' : ''}
                onClick={() => onSelectCategory(category.id)}
              >
                {category.name}
                {/* REMOVED: <span className="category-count">({category.productCount || 0})</span> */}
              </button>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="sidebar-section">
        <button 
          className="btn-clear-filters"
          onClick={() => {
            onSelectCategory(null);
            handlePriceChange(0, 1000);
          }}
        >
          Clear All Filters
        </button>
      </div>
    </div>
  );
};

export default CategorySidebar;