import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Cart.css';

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Replace with actual user ID from your auth context or props
  const userId = 1; // This should come from your authentication system

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8080/api/cart/${userId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch cart');
      }
      
      const cartData = await response.json();
      setCart(cartData);
      setError('');
    } catch (err) {
      console.error('Error fetching cart:', err);
      setError('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/cart/${userId}/add/${productId}?quantity=${quantity}`,
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
      setCart(updatedCart);
    } catch (err) {
      console.error('Error adding to cart:', err);
      setError('Failed to add item to cart');
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      const response = await fetch(
        `http://localhost:8080/api/cart/${userId}/update/${productId}?quantity=${newQuantity}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update quantity');
      }

      const updatedCart = await response.json();
      setCart(updatedCart);
    } catch (err) {
      console.error('Error updating quantity:', err);
      setError('Failed to update quantity');
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/cart/${userId}/remove/${productId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to remove item from cart');
      }

      const updatedCart = await response.json();
      setCart(updatedCart);
    } catch (err) {
      console.error('Error removing from cart:', err);
      setError('Failed to remove item from cart');
    }
  };

  const clearCart = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/cart/${userId}/clear`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to clear cart');
      }

      // After clearing, fetch the cart again to get empty state
      await fetchCart();
    } catch (err) {
      console.error('Error clearing cart:', err);
      setError('Failed to clear cart');
    }
  };

  const handleCheckout = () => {
    if (!cart || cart.cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    alert('Proceeding to checkout!');
    // Navigate to checkout page
  };

  const continueShopping = () => {
    navigate('/products');
  };

  const calculateItemsTotal = () => {
    if (!cart || !cart.cartItems) return 0;
    return cart.cartItems.reduce((total, item) => {
      const itemTotal = item.product?.price * item.quantity;
      return total + (itemTotal || 0);
    }, 0);
  };

  const calculateItemsCount = () => {
    if (!cart || !cart.cartItems) return 0;
    return cart.cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  if (loading) {
    return <div className="loading">Loading cart...</div>;
  }

  if (error) {
    return (
      <div className="error-message">
        <p>{error}</p>
        <button onClick={fetchCart}>Retry</button>
      </div>
    );
  }

  const cartItems = cart?.cartItems || [];

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h1>Shopping Cart</h1>
        <div className="cart-actions">
          <button className="continue-shopping-btn" onClick={continueShopping}>
            Continue Shopping
          </button>
          {cartItems.length > 0 && (
            <button className="clear-cart-btn" onClick={clearCart}>
              Clear Cart
            </button>
          )}
        </div>
      </div>

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <div className="empty-cart-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Add some products to your cart to see them here.</p>
          <button className="continue-shopping-btn" onClick={continueShopping}>
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-items">
            {cartItems.map(item => (
              <div key={item.id} className="cart-item">
                <div className="item-image">
                  <img 
                    src={item.product?.imageUrl || '/placeholder-image.jpg'} 
                    alt={item.product?.name} 
                  />
                </div>
                
                <div className="item-details">
                  <h3 className="item-name">{item.product?.name}</h3>
                  <p className="item-category">{item.product?.category?.name}</p>
                  <p className="item-description">{item.product?.description}</p>
                </div>

                <div className="item-price">
                  P{item.product?.price?.toLocaleString()}
                </div>

                <div className="item-quantity">
                  <button
                    className="quantity-btn"
                    onClick={() => updateQuantity(item.product?.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <span className="quantity-display">{item.quantity}</span>
                  <button
                    className="quantity-btn"
                    onClick={() => updateQuantity(item.product?.id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>

                <div className="item-total">
                  P{((item.product?.price || 0) * item.quantity).toLocaleString()}
                </div>

                <button
                  className="remove-btn"
                  onClick={() => removeFromCart(item.product?.id)}
                  title="Remove item"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="summary-card">
              <h3>Order Summary</h3>
              
              <div className="summary-row">
                <span>Items ({calculateItemsCount()})</span>
                <span>P{calculateItemsTotal().toLocaleString()}</span>
              </div>
              
              <div className="summary-row">
                <span>Shipping</span>
                <span>P{calculateItemsTotal() > 2000 ? '0' : '99'}</span>
              </div>
              
              <div className="summary-row">
                <span>Tax (18%)</span>
                <span>P{(calculateItemsTotal() * 0.18).toLocaleString()}</span>
              </div>
              
              <div className="summary-divider"></div>
              
              <div className="summary-row total">
                <span>Total</span>
                <span>
                  P{(
                    calculateItemsTotal() + 
                    (calculateItemsTotal() > 2000 ? 0 : 99) + 
                    (calculateItemsTotal() * 0.18)
                  ).toLocaleString()}
                </span>
              </div>

              <button className="checkout-btn" onClick={handleCheckout}>
                Proceed to Checkout
              </button>

              {calculateItemsTotal() < 2000 && (
                <div className="shipping-notice">
                  Add P{(2000 - calculateItemsTotal()).toLocaleString()} more for free shipping!
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;