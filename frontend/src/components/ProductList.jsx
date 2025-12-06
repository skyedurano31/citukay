// components/ProductList.js
import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { api } from '../services/api';
import './ProductList.css'

const ProductList = ({ categoryId, searchQuery }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProducts();
  }, [categoryId, searchQuery]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      let data;
      
      if (searchQuery) {
        data = await api.searchProducts(searchQuery);
      } else if (categoryId) {
        data = await api.getProductsByCategory(categoryId);
      } else {
        data = await api.getProducts();
      }
      
      setProducts(data);
    } catch (err) {
      setError('Failed to load products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (products.length === 0) {
    return <div className="no-products">No products found</div>;
  }

  return (
    <div className="product-grid">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductList;