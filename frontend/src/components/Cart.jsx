// components/Cart.js
import React from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import CartItem from './CartItem';

const Cart = () => {
  const { cart, cartCount, cartTotal, clearCart, loading } = useCart();
  const navigate = useNavigate();

  if (loading) {
    return <div className="loading">Loading cart...</div>;
  }

  // Get items from cart object
  const items = cart?.cartItems || [];

  if (!cart || items.length === 0) {
    return (
      <div className="cart-empty">
        <h2>Your cart is empty</h2>
        <p>Add some products to get started!</p>
        <button onClick={() => navigate('/products')}>Browse Products</button>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h1>Shopping Cart ({items.length} items)</h1>
        <button onClick={clearCart} className="clear-cart-btn">
          Clear Cart
        </button>
      </div>

      <div className="cart-content">
        <div className="cart-items">
          {items.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>
        
        <div className="cart-summary">
          <h3>Order Summary</h3>
          <div className="summary-row">
            <span>Subtotal ({items.length} items)</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
          
          <button 
            onClick={() => navigate('/checkout')}
            className="checkout-btn"
          >
            Proceed to Checkout
          </button>
          
          <button 
            onClick={() => navigate('/products')}
            className="continue-shopping-btn"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;