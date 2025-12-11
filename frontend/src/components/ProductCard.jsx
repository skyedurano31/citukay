// components/ProductCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './ProductCard.css'

const ProductCard = ({ product, index }) => { // <--- NOTE: Added 'index' prop for the number badge
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
    
    // If you still want the cart logic, keep this block, but the button is hidden by CSS.
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
            e.target.src = '/images/default-product.jpg';
            e.target.onerror = null; 
          }}
        />
      </div>
      
      {/* The product-info is the overlay that holds all the text content */}
      <div className="product-info">
        
        {/* 1. Product Number (Top-Left, using index if passed from the map) */}
        {/* NOTE: You must pass the index prop from the mapping component (e.g., index + 1) */}
        <span className="product-number-badge">
          {index !== undefined ? `${String(index + 1).padStart(2, '0')}` : 'XX'}
        </span>
        
        {/* 2. Main Title */}
        <h3>{product.name}</h3>
        
        {/* 3. Price (The largest font size) */}
        <div className="product-price">P{product.price?.toFixed(2)}</div>
        
        {/* 4. Size (Using the new details text style) */}
        {/* Assuming your product object has 'size' and 'condition' properties */}
        {product.size && (
          <div className="product-details-text">Size: {product.size}</div>
        )}
        
        {/* 5. Condition (Using the new details text style) */}
        {product.condition && (
          <div className="product-details-text">Condition: {product.condition}</div>
        )}
        
        {/* Removed: product-description, stock-status */}
      </div>
      
      {/* Removed: add-to-cart-btn (since it's hidden by CSS anyway) */}
    </div>
  );
};

export default ProductCard;