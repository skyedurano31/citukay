import React, { useState, useEffect } from 'react';
import { productsAPI } from '../services/api';
import ProductCard from './ProductCard';
import './ProductList.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Temporary sample products (used only if API fails or returns empty)
  const sampleProducts = [
    {
      id: 1,
      name: "Wireless Headphones",
      description: "High quality Bluetooth headphones.",
      price: 1299,
      stockQuantity: 5,
      imageUrl: "https://via.placeholder.com/150"
    },
    {
      id: 2,
      name: "Gaming Mouse",
      description: "RGB ergonomic gaming mouse.",
      price: 899,
      stockQuantity: 0,
      imageUrl: "https://via.placeholder.com/150"
    },
    {
      id: 3,
      name: "Mechanical Keyboard",
      description: "Tactile blue switches.",
      price: 1599,
      stockQuantity: 12,
      imageUrl: "https://via.placeholder.com/150"
    },
    {
      id: 4,
      name: "Mechanical Keyboard",
      description: "Tactile blue switches.",
      price: 1599,
      stockQuantity: 12,
      imageUrl: "https://via.placeholder.com/150"
    },
    {
      id: 5,
      name: "Mechanical Keyboard",
      description: "Tactile blue switches.",
      price: 1599,
      stockQuantity: 12,
      imageUrl: "https://via.placeholder.com/150"
    },
    {
      id: 6,
      name: "Mechanical Keyboard",
      description: "Tactile blue switches.",
      price: 1599,
      stockQuantity: 12,
      imageUrl: "https://via.placeholder.com/150"
    }
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await productsAPI.getAllProducts();

      if (response.data.length === 0) {
        // Use temp products if backend returns empty list
        console.warn("API returned no products — using sample products.");
        setProducts(sampleProducts);
      } else {
        setProducts(response.data);
      }

    } catch (err) {
      // Use temp products on API error
      console.error("Error fetching products:", err);
      setError('Failed to fetch products — showing sample products');
      setProducts(sampleProducts);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading products...</div>;

  return (
    <div className="product-list">
      {error && <div className="error">{error}</div>}
      
      <div className="products-grid">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
