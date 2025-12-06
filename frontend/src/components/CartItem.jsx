// components/CartItem.jsx
import React from 'react';
import { useCart } from '../context/CartContext';
import './CartItem.css'

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  console.log('CartItem received:', item);
  console.log('Item product:', item?.product);
  console.log('Item product price:', item?.product?.price);

  // Safely extract values with defaults
  const product = item?.product || {};
  const quantity = item?.quantity || 1;
  const price = product?.price || 0; // Default to 0 if undefined
  const itemId = item?.id;
  const productName = product?.name || 'Product';
  const productImage = product?.imageUrl;

  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/images/default-product.jpg';
    
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    const backendUrl = 'http://localhost:8080';
    // Fix double slash issue in your image URLs
    const cleanPath = imagePath.replace('//', '/');
    return `${backendUrl}${cleanPath}`;
  };

  const handleImageError = (e) => {
    console.log('Image error for:', e.target.src);
    e.target.src = '/images/default-product.jpg';
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && product?.id) {
      updateQuantity(product.id, newQuantity);
    }
  };

  const handleRemove = () => {
    if (product?.id) {
      removeFromCart(product.id);
    }
  };

  const itemTotal = (price || 0) * quantity;

  return (
    <div className="cart-item">
      <div className="cart-item-image">
        <img 
          src={getImageUrl(productImage)} 
          alt={productName}
          onError={handleImageError}
          style={{
            width: '100px',
            height: '100px',
            objectFit: 'cover',
            borderRadius: '4px'
          }}
        />
      </div>
      
      <div className="cart-item-details">
        <h4>{productName}</h4>
        <p className="cart-item-price">
          ${typeof price === 'number' ? price.toFixed(2) : '0.00'} each
        </p>
        {product?.sku && <p className="cart-item-sku">SKU: {product.sku}</p>}
        {product?.category?.name && (
          <p className="cart-item-category">Category: {product.category.name}</p>
        )}
      </div>
      
      <div className="cart-item-quantity">
        <button 
          onClick={() => handleQuantityChange(quantity - 1)}
          disabled={quantity <= 1}
        >
          -
        </button>
        <span>{quantity}</span>
        <button onClick={() => handleQuantityChange(quantity + 1)}>
          +
        </button>
      </div>
      
      <div className="cart-item-total">
        <p>${itemTotal.toFixed(2)}</p>
      </div>
      
      <div className="cart-item-remove">
        <button onClick={handleRemove}>Remove</button>
      </div>
    </div>
  );
};

export default CartItem;