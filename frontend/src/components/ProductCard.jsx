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

    if (product.stockQuantity === 0) {
      alert('This product is out of stock');
      return;
    }

    // Add to cart logic
    const existingCart = JSON.parse(localStorage.getItem('cartItems') || '[]');
    
    const existingItem = existingCart.find(item => item.id === product.id);
    
    if (existingItem) {
      // Check if we're exceeding available stock
      if (existingItem.quantity >= product.stockQuantity) {
        alert(`Cannot add more. Only ${product.stockQuantity} items available in stock.`);
        return;
      }
      existingItem.quantity += 1;
    } else {
      existingCart.push({
        ...product,
        quantity: 1
      });
    }
    
    localStorage.setItem('cartItems', JSON.stringify(existingCart));
    alert(`${product.name} added to cart!`);
    
    // Dispatch event to update navbar cart count
    window.dispatchEvent(new Event('cartUpdated'));
  };

  return (
    <div className="product-card">
      <div className="product-image">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} />
        ) : (
          <div className="no-image">sample image</div>
        )}
      </div>
      
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.description}</p>
        <p className="product-price">P{product.price}</p>
        <p className="product-stock">
          {product.stockQuantity > 0 ? 
            `In Stock (${product.stockQuantity})` : 'Out of Stock'
          }
        </p>
        
        <button 
          className={`add-to-cart-btn ${product.stockQuantity === 0 ? 'disabled' : ''}`}
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