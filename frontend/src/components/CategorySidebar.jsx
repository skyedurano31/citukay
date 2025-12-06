import React, { useState, useEffect, useRef } from 'react';
import { productService } from '../services/productService';
import './CategorySidebar.css';

const CategorySidebar = ({ onSelectCategory, selectedCategory }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef(null);
  const [showScrollLeft, setShowScrollLeft] = useState(false);
  const [showScrollRight, setShowScrollRight] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    checkScrollButtons();
    window.addEventListener('resize', checkScrollButtons);
    return () => window.removeEventListener('resize', checkScrollButtons);
  }, [categories]);

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

  const checkScrollButtons = () => {
    const container = scrollContainerRef.current;
    if (container) {
      setShowScrollLeft(container.scrollLeft > 0);
      setShowScrollRight(
        container.scrollLeft < container.scrollWidth - container.clientWidth
      );
    }
  };

  const scrollLeft = () => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollBy({ left: -200, behavior: 'smooth' });
      setTimeout(checkScrollButtons, 300);
    }
  };

  const scrollRight = () => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollBy({ left: 200, behavior: 'smooth' });
      setTimeout(checkScrollButtons, 300);
    }
  };

  const handleScroll = () => {
    checkScrollButtons();
  };

  if (loading) {
    return <div className="category-sidebar loading">Loading categories...</div>;
  }

  return (
    <div className="scroll-container">
      {showScrollLeft && (
        <button className="scroll-btn left" onClick={scrollLeft}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}
      
      <div 
        className="category-sidebar" 
        ref={scrollContainerRef}
        onScroll={handleScroll}
      >
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
                {/* Optional: Add count back if you have it */}
                {/* {category.productCount > 0 && (
                  <span className="category-count">{category.productCount}</span>
                )} */}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {showScrollRight && (
        <button className="scroll-btn right" onClick={scrollRight}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default CategorySidebar;