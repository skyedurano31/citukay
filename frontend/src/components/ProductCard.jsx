// components/ProductCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './ProductCard.css'

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.stopPropagation();
    
    console.log('User status:', {
      isLoggedIn: !!user,
      userId: user?.id,
      userName: user?.name
    });
    
    if (isInStock) {
      addToCart(product, 1);
      navigate('/cart');
    }
  };

  const handleViewDetails = () => {
    navigate(`/products/${product.id}`);
  };

  const stock = product.stockQuantity || 0;
  const isInStock = stock > 0;

  return (
    <div className="product-card" onClick={handleViewDetails}>
      <div className="product-image">
        <img 
          src={product.imageUrl || '/images/default-product.jpg'} 
          alt={product.name}
          onError={(e) => {
            // Fallback if image fails to load
            e.target.src = '/images/default-product.jpg';
            e.target.onerror = null; // Prevent infinite loop
          }}
        />
      </div>
      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="product-description">
          {product.description?.substring(0, 100)}...
        </p>
        <div className="product-price">${product.price?.toFixed(2)}</div>
        
        <div className={`stock-status ${isInStock ? 'in-stock' : 'out-of-stock'}`}>
          {isInStock ? `In Stock (${stock})` : 'Out of Stock'}
        </div>
      </div>
      <button 
        className={`add-to-cart-btn ${!isInStock ? 'disabled' : ''}`}
        onClick={handleAddToCart}
        disabled={!isInStock}
      >
        {isInStock ? 'Add to Cart' : 'Out of Stock'}
      </button>
    </div>
  );
};

export default ProductCard;