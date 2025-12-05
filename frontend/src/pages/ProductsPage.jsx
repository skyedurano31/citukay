// pages/ProductsPage.js
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductList from '../components/ProductList';
import CategorySidebar from '../components/CategorySidebar';
import SearchBar from '../components/SearchBar';

const ProductsPage = () => {
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [sortOption, setSortOption] = useState('featured');

  useEffect(() => {
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    
    if (search) {
      setSearchQuery(search);
    }
    if (category) {
      setSelectedCategory(parseInt(category));
    }
  }, [searchParams]);

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const handlePriceFilter = (min, max) => {
    setPriceRange({ min, max });
  };

  return (
    <div className="products-page">
      <div className="page-header">
        <h1>All Products</h1>
        <div className="filters-bar">
          <SearchBar />
          
          <div className="filter-group">
            <label>Sort By:</label>
            <select value={sortOption} onChange={handleSortChange}>
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
              <option value="name-desc">Name: Z to A</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>Price Range:</label>
            <div className="price-range">
              <input 
                type="range" 
                min="0" 
                max="1000" 
                value={priceRange.max}
                onChange={(e) => handlePriceFilter(priceRange.min, e.target.value)}
              />
              <span>${priceRange.min} - ${priceRange.max}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="products-content">
        <CategorySidebar 
          onSelectCategory={setSelectedCategory}
          selectedCategory={selectedCategory}
          onPriceFilter={handlePriceFilter}
        />
        
        <div className="products-grid-area">
          <ProductList 
            categoryId={selectedCategory}
            searchQuery={searchQuery}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;