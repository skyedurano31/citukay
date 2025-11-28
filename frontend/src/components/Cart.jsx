import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Cart.css';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Cart component mounted - loading from localStorage');
    const savedCart = localStorage.getItem('cartItems');
    console.log('Saved cart from localStorage:', savedCart);
    
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        console.log('Parsed cart items:', parsedCart);
        setCartItems(parsedCart);
      } catch (error) {
        console.error('Error parsing cart items:', error);
        setCartItems([]);
      }
    } else {
      console.log('No cart items found in localStorage');
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    console.log('Cart items updated:', cartItems);
  }, [cartItems]);

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    alert('Proceeding to checkout!');
  };

  const continueShopping = () => {
    navigate('/products');
  };

  if (loading) {
    return <div className="loading">Loading cart...</div>;
  }

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
                  <img src={item.imageUrl} alt={item.name} />
                </div>
                
                <div className="item-details">
                  <h3 className="item-name">{item.name}</h3>
                  <p className="item-category">{item.category?.name}</p>
                  <p className="item-description">{item.description}</p>
                </div>

                <div className="item-price">
                  P{item.price.toLocaleString()}
                </div>

                <div className="item-quantity">
                  <button
                    className="quantity-btn"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <span className="quantity-display">{item.quantity}</span>
                  <button
                    className="quantity-btn"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>

                <div className="item-total">
                  P{(item.price * item.quantity).toLocaleString()}
                </div>

                <button
                  className="remove-btn"
                  onClick={() => removeFromCart(item.id)}
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
                <span>Items ({cartItems.reduce((total, item) => total + item.quantity, 0)})</span>
                <span>P{calculateTotal().toLocaleString()}</span>
              </div>
              
              <div className="summary-row">
                <span>Shipping</span>
                <span>P{calculateTotal() > 2000 ? '0' : '99'}</span>
              </div>
              
              <div className="summary-row">
                <span>Tax (18%)</span>
                <span>P{(calculateTotal() * 0.18).toLocaleString()}</span>
              </div>
              
              <div className="summary-divider"></div>
              
              <div className="summary-row total">
                <span>Total</span>
                <span>
                  P{(
                    calculateTotal() + 
                    (calculateTotal() > 2000 ? 0 : 99) + 
                    (calculateTotal() * 0.18)
                  ).toLocaleString()}
                </span>
              </div>

              <button className="checkout-btn" onClick={handleCheckout}>
                Proceed to Checkout
              </button>

              {calculateTotal() < 2000 && (
                <div className="shipping-notice">
                  Add P{(2000 - calculateTotal()).toLocaleString()} more for free shipping!
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