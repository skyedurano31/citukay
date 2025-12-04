import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { isAuthenticated, user } = useAuth();
  const [addingToCart, setAddingToCart] = useState(false);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      alert('Please login to add items to cart');
      return;
    }

    if (product.stockQuantity === 0) {
      alert('This product is out of stock');
      return;
    }

    try {
      setAddingToCart(true);
      
      // Use user ID from auth context, fallback to 1 for testing
      const userId = user?.id || 1;
      
      const response = await fetch(
        `http://localhost:8080/api/cart/${userId}/add/${product.id}?quantity=1`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to add item to cart');
      }

      const updatedCart = await response.json();
      
      alert(`${product.name} added to cart!`);
      
      // Dispatch event to update navbar cart count
      window.dispatchEvent(new Event('cartUpdated'));
      
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Failed to add item to cart. Please try again.');
    } finally {
      setAddingToCart(false);
    }
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
          disabled={product.stockQuantity === 0 || addingToCart}
        >
          {addingToCart ? 'Adding...' : 
           product.stockQuantity > 0 ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;