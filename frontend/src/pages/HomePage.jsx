// pages/HomePage.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductList from '../components/ProductList';
import CategorySidebar from '../components/CategorySidebar.jsx';
import { api } from '../services/api';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadFeaturedProducts();
  }, []);

  const loadFeaturedProducts = async () => {
    try {
      const products = await api.getProducts();
      // Get first 6 products as featured
      setFeaturedProducts(products.slice(0, 6));
    } catch (error) {
      console.error('Error loading featured products:', error);
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
          <h1>Welcome to Our E-Commerce Store</h1>
          <p>Discover amazing products at great prices</p>
          <Link to="/products" className="btn-hero">
            Shop Now
          </Link>
        </div>
      </div>

      <div className="home-content">
        <CategorySidebar 
          onSelectCategory={setSelectedCategory}
          selectedCategory={selectedCategory}
        />
        
        <div className="main-content-area">
          <div className="section-header">
            <h2>Featured Products</h2>
            <Link to="/products" className="view-all">
              View All Products →
            </Link>
          </div>
          
          <ProductList 
            categoryId={selectedCategory}
            searchQuery={searchQuery}
          />
          
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