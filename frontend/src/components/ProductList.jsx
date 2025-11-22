import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productsAPI } from '../services/api';
import ProductCard from './ProductCard';
import './ProductList.css';


const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Sample products with category objects (matching your database structure)

  const navigate = useNavigate();

  const sampleProducts = [
    {
      id: 1,
      name: "Wireless Headphones",
      description: "High quality Bluetooth headphones.",
      price: 1299,
      stockQuantity: 5,
      imageUrl: "https://via.placeholder.com/150",
      category: {
        id: 1,
        name: "Electronics"
      }
    },
    {
      id: 2,
      name: "Gaming Mouse",
      description: "RGB ergonomic gaming mouse.",
      price: 899,
      stockQuantity: 0,
      imageUrl: "https://via.placeholder.com/150",
      category: {
        id: 1,
        name: "Electronics"
      }
    },
    {
      id: 3,
      name: "Mechanical Keyboard",
      description: "Tactile blue switches.",
      price: 1599,
      stockQuantity: 12,
      imageUrl: "https://via.placeholder.com/150",
      category: {
        id: 1,
        name: "Electronics"
      }
    },
    {
      id: 4,
      name: "Cotton T-Shirt",
      description: "Comfortable cotton t-shirt.",
      price: 599,
      stockQuantity: 20,
      imageUrl: "https://via.placeholder.com/150",
      category: {
        id: 2,
        name: "Clothing"
      }
    },
    {
      id: 5,
      name: "Coffee Mug",
      description: "Ceramic coffee mug.",
      price: 299,
      stockQuantity: 15,
      imageUrl: "https://via.placeholder.com/150",
      category: {
        id: 3,
        name: "Home & Kitchen"
      }
    },
    {
      id: 6,
      name: "Desk Lamp",
      description: "LED desk lamp.",
      price: 799,
      stockQuantity: 8,
      imageUrl: "https://via.placeholder.com/150",
      category: {
        id: 3,
        name: "Home & Kitchen"
      }
    }
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    // Filter products when category changes or products update
    if (selectedCategory === 'all') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(
        products.filter(product => 
          product.category && product.category.id.toString() === selectedCategory
        )
      );
    }
  }, [selectedCategory, products]);

  // Function to extract unique categories from products
  const extractCategories = (productsList) => {
    const categoriesMap = new Map();
    
    productsList.forEach(product => {
      if (product.category && product.category.id) {
        categoriesMap.set(product.category.id, product.category);
      }
    });
    
    return Array.from(categoriesMap.values());
  };

  const fetchProducts = async () => {
    try {
      const response = await productsAPI.getAllProducts();
      let productsData = [];

      if (response.data.length === 0) {
        // Use temp products if backend returns empty list
        console.warn("API returned no products — using sample products.");
        productsData = sampleProducts;
      } else {
        productsData = response.data;
      }

      setProducts(productsData);
      setFilteredProducts(productsData);
      
      // Extract unique categories from the products
      const uniqueCategories = extractCategories(productsData);
      setCategories([{ id: 'all', name: 'All Products' }, ...uniqueCategories]);

    } catch (err) {
      // Use temp products on API error
      console.error("Error fetching products:", err);
      setError('Failed to fetch products — showing sample products');
      setProducts(sampleProducts);
      setFilteredProducts(sampleProducts);
      
      // Extract unique categories from sample products
      const uniqueCategories = extractCategories(sampleProducts);
      setCategories([{ id: 'all', name: 'All Products' }, ...uniqueCategories]);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  if (loading) return <div className="loading">Loading products...</div>;

  return (
    <div className="product-list">
      {error && <div className="error">{error}</div>}
      
      {/* Category Filter */}
      <div className="category-filter">
        <div className="category-buttons">
          {categories.map(category => (
            <button
              key={category.id}
              className={`category-btn ${selectedCategory === category.id.toString() ? 'active' : ''}`}
              onClick={() => handleCategoryChange(category.id.toString())}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="products-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <div className="no-products">
            No products found in this category.
          </div>
        )}
      </div>

      
    </div>
  );
};

export default ProductList;