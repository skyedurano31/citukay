import React from 'react';
import { useAuth } from '../context/AuthContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { isAuthenticated } = useAuth();

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      alert('Please login to add items to cart');
      return;
    }
    // Add to cart logic here
    alert(`Added ${product.name} to cart`);
  };

  return (
    <div className="product-card">
      <div className="product-image">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} />
        ) : (
          <div className="no-image">No Image</div>
        )}
      </div>
      
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.description}</p>
        <p className="product-price">${product.price}</p>
        <p className="product-stock">
          {product.stockQuantity > 0 ? 
            `In Stock (${product.stockQuantity})` : 'Out of Stock'
          }
        </p>
        
        <button 
          className="add-to-cart-btn"
          onClick={handleAddToCart}
          disabled={product.stockQuantity === 0}
        >
          {product.stockQuantity > 0 ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;