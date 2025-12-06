// components/ProductDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api'; // Use api instead of productService
import './ProductDetail.css'

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      console.log('Loading product with ID:', id);
      
      // Use api.getProductById which transforms image URLs
      const data = await api.getProductById(id);
      console.log('Product loaded:', data);
      console.log('Product image URL:', data.imageUrl);
      
      setProduct(data);
      setError('');
    } catch (err) {
      console.error('Error loading product:', err);
      setError('Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  // Function to build full image URL (same as in ProductCard)
  const getImageUrl = (imagePath) => {
    if (!imagePath) {
      console.log('No image path provided');
      return '/images/default-product.jpg';
    }
    
    // If it's already a full URL
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // For relative paths, add the Spring Boot URL
    const backendUrl = 'http://localhost:8080';
    const fullUrl = `${backendUrl}${imagePath}`;
    console.log('Built image URL:', fullUrl);
    
    return fullUrl;
  };

  const handleImageError = (e) => {
    console.log('Image failed to load:', e.target.src);
    setImageError(true);
    e.target.src = '/images/default-product.jpg';
    e.target.alt = 'Default product image';
  };

  const handleAddToCart = () => {
    console.log('Adding to cart - User:', user);
    console.log('Product:', product);
    if (product && isInStock) {
      addToCart(product, quantity);
      navigate('/cart');
    }
  };

  const stock = product?.stockQuantity || 0;
  const isInStock = stock > 0;

  const incrementQuantity = () => {
    if (quantity < stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="error">
        <p>{error || 'Product not found'}</p>
        <button onClick={() => navigate('/products')}>Back to Products</button>
      </div>
    );
  }

  return (
    <div className="product-detail">
      <button onClick={() => navigate(-1)} className="back-btn">
        ← Back
      </button>
      
      <div className="product-detail-content">
        <div className="product-images">
          <div className="main-image">
            <img 
              src={getImageUrl(product.imageUrl)} 
              alt={product.name}
              onError={handleImageError}
              onLoad={() => console.log('Image loaded successfully')}
              style={{
                border: imageError ? '2px solid red' : 'none',
                backgroundColor: imageError ? '#ffe6e6' : 'transparent'
              }}
            />
            {imageError && (
              <div style={{
                position: 'absolute',
                top: '10px',
                left: '10px',
                background: 'rgba(255,0,0,0.7)',
                color: 'white',
                padding: '5px',
                fontSize: '12px'
              }}>
                Image failed to load
              </div>
            )}
          </div>
          
          {/* Debug info */}
          <div style={{
            marginTop: '10px',
            padding: '10px',
            background: '#f5f5f5',
            borderRadius: '5px',
            fontSize: '12px'
          }}>
            <p><strong>Debug Info:</strong></p>
            <p>Image URL in DB: {product.imageUrl}</p>
            <p>Final URL: {getImageUrl(product.imageUrl)}</p>
            <button 
              onClick={() => window.open(getImageUrl(product.imageUrl), '_blank')}
              style={{ marginTop: '5px', fontSize: '12px' }}
            >
              Open Image in New Tab
            </button>
          </div>
        </div>
        
        <div className="product-info-detail">
          <h1>{product.name}</h1>
          <div className="product-price-large">${product.price?.toFixed(2)}</div>
          
          <div className="product-meta">
            <div className={`stock-status ${isInStock ? 'in-stock' : 'out-of-stock'}`}>
              {isInStock ? `In Stock (${stock} available)` : 'Out of Stock'}
            </div>
            <div className="product-category">
              Category: {product.category?.name || 'Uncategorized'}
            </div>
          </div>
          
          <div className="product-description-full">
            <h3>Description</h3>
            <p>{product.description || 'No description available.'}</p>
          </div>
          
          {isInStock && (
            <div className="add-to-cart-section">
              <div className="quantity-selector">
                <button onClick={decrementQuantity} disabled={quantity <= 1}>-</button>
                <input
                  type="number"
                  min="1"
                  max={stock}
                  value={quantity}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (value >= 1 && value <= stock) {
                      setQuantity(value);
                    }
                  }}
                />
                <button onClick={incrementQuantity} disabled={quantity >= stock}>
                  +
                </button>
              </div>
              
              <button onClick={handleAddToCart} className="add-to-cart-btn-large">
                Add to Cart - ${(product.price * quantity).toFixed(2)}
              </button>
              
              <button 
                onClick={() => {
                  addToCart(product, quantity);
                  navigate('/checkout');
                }}
                className="buy-now-btn"
              >
                Buy Now
              </button>
            </div>
          )}
          
          <div className="product-specs">
            <h3>Specifications</h3>
            <table>
              <tbody>
                <tr>
                  <td>Product ID</td>
                  <td>{product.id}</td>
                </tr>
                <tr>
                  <td>SKU</td>
                  <td>{product.sku || 'N/A'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;