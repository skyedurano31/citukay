import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import './HomePage.css';

// Create a mapping object for category images
// This can be in a separate file (e.g., categoryImages.js) if you prefer
const CATEGORY_IMAGE_MAP = {
  // Exact category names as they come from database
  'Electronics': 'electronics.jpg',
  'Clothing': 'fashion.jpg',           // Different filename
  'Home & Garden': 'home-decor.jpg',    // Different filename
  'Books': 'books-library.jpg',         // Different filename
  'Sports': 'sports-equipment.jpg',     // Different filename
  'Beauty': 'beauty-cosmetics.jpg',     // Different filename
  'Toys': 'toys-games.jpg',
  'Furniture': 'furniture-home.jpg',
  'Automotive': 'cars-parts.jpg',
  'running': 'shoescategory.jpg',
  'basketball': 'shoescategory.jpg',
  // Add more as needed
};

const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  // Helper function to get category image
  const getCategoryImage = (categoryName) => {
    // Check if we have a specific image for this category
    if (CATEGORY_IMAGE_MAP[categoryName]) {
      return `/images/categories/${CATEGORY_IMAGE_MAP[categoryName]}`;
    }
    
    // Fallback: try case-insensitive match
    const lowerCaseName = categoryName.toLowerCase();
    const matchedKey = Object.keys(CATEGORY_IMAGE_MAP).find(key => 
      key.toLowerCase() === lowerCaseName
    );
    
    if (matchedKey) {
      return `/images/categories/${CATEGORY_IMAGE_MAP[matchedKey]}`;
    }
    
    // Final fallback: default image
    return '/images/default-category.jpg';
  };

  const loadCategories = async () => {
    try {
      const categoriesData = await api.getCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading categories:', error);
      // Fallback categories
      setCategories([
        { id: 1, name: 'Electronics', productCount: 12 },
        { id: 2, name: 'Clothing', productCount: 24 },
        { id: 3, name: 'Home & Garden', productCount: 18 },
        { id: 4, name: 'Books', productCount: 32 },
        { id: 5, name: 'Sports', productCount: 15 },
        { id: 6, name: 'Beauty', productCount: 22 },
        { id: 7, name: 'Toys', productCount: 8 },
        { id: 8, name: 'Furniture', productCount: 14 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="home-page">
      <div className="hero-section">
        <div className="hero-content">
          <h1>Welcome to CITU-UKAY</h1>
          <p>Discover amazing second-hand treasures at great prices</p>
          <Link to="/products" className="btn-hero">
            Shop Now
          </Link>
        </div>
      </div>

      <div className="home-content">
        <div className="main-content-area">
          <div className="categories-showcase">
            <div className="categories-grid">
              {categories.map(category => (
                <Link 
                  key={category.id} 
                  to={`/products?category=${category.id}`}
                  className="category-card"
                >
                  <div className="category-image">
                    <img 
                      src={getCategoryImage(category.name)}
                      alt={category.name}
                      onError={(e) => {
                        e.target.src = '/images/default-category.jpg';
                      }}
                    />
                  </div>
                  <div className="category-info">
                    <h3>{category.name}</h3>
                    {category.productCount && (
                      <span className="category-count">
                        {category.productCount} items
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
          
          <div className="promo-banner">
            <div className="promo-content">
              <h3>Free Shipping on Orders Over $50</h3>
              <p>No minimum purchase required. Limited time offer.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;