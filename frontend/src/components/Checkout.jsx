// components/Checkout.jsx
import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const { cart, cartTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [userAddresses, setUserAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [formData, setFormData] = useState({
    paymentMethod: 'credit-card'
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fetchingAddresses, setFetchingAddresses] = useState(true);

  // Get items from cart object
  const items = cart?.cartItems || [];
  
  // Fetch user addresses on component mount
  useEffect(() => {
    if (user?.id) {
      fetchUserAddresses();
    }
  }, [user]);

  const fetchUserAddresses = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/addresses/user/${user.id}`);
      if (response.ok) {
        const addresses = await response.json();
        setUserAddresses(addresses);
        
        // Select default address if available
        const defaultAddress = addresses.find(addr => addr.isDefault);
        if (defaultAddress) {
          setSelectedAddress(defaultAddress);
        } else if (addresses.length > 0) {
          setSelectedAddress(addresses[0]);
        }
      }
    } catch (err) {
      console.error('Failed to fetch addresses:', err);
    } finally {
      setFetchingAddresses(false);
    }
  };

  const handlePaymentMethodChange = (e) => {
    setFormData(prev => ({
      ...prev,
      paymentMethod: e.target.value
    }));
  };

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate address is selected
    if (!selectedAddress) {
      setError('Please select a shipping address');
      setLoading(false);
      return;
    }

    try {
      // First, get the current cart from backend to ensure we have correct data
      const cartResponse = await fetch(`http://localhost:8080/api/cart/${user.id}`);
      if (!cartResponse.ok) {
        throw new Error('Failed to fetch cart');
      }
      
      const currentCart = await cartResponse.json();
      const cartItems = currentCart.cartItems || [];
      
      if (cartItems.length === 0) {
        setError('Your cart is empty');
        setLoading(false);
        return;
      }
      
      console.log('Cart items from backend:', cartItems);

      // Prepare items in the format expected by backend
      const orderItems = cartItems.map(item => {
        // Check if product exists and has required properties
        if (!item.product || !item.product.id || !item.product.price) {
          console.error('Invalid cart item:', item);
          throw new Error(`Invalid product in cart: ${JSON.stringify(item)}`);
        }
        
        return {
          productId: item.product.id,
          quantity: item.quantity || 1,
          price: item.product.price
        };
      });

      console.log('Sending order items to backend:', orderItems);
      console.log('User ID:', user.id);
      console.log('Selected address:', selectedAddress);
      console.log('Payment method:', formData.paymentMethod);

      // Send to backend - MATCHING THE EXISTING ENDPOINT
      const response = await fetch(`http://localhost:8080/api/orders/user/${user.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderItems)
      });

      console.log('Response status:', response.status);
      
      if (response.ok) {
        const order = await response.json();
        console.log('Order created successfully:', order);
        
        // OPTIONAL: Create payment record
        try {
          await fetch(`http://localhost:8080/api/payments/order/${order.id}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `paymentMethod=${formData.paymentMethod}`
          });
          console.log('Payment record created');
        } catch (paymentErr) {
          console.warn('Payment creation failed (order still created):', paymentErr);
        }
        
        // OPTIONAL: Clear the cart
        try {
          await fetch(`http://localhost:8080/api/cart/${user.id}/clear`, {
            method: 'DELETE',
          });
          console.log('Cart cleared');
        } catch (clearErr) {
          console.warn('Failed to clear cart:', clearErr);
        }
        
        navigate(`/order-confirmation/${order.id}`);
      } else {
        let errorMessage = 'Failed to create order';
        try {
          const errorText = await response.text();
          if (errorText) {
            errorMessage = errorText;
          }
        } catch (e) {
          console.error('Failed to read error response:', e);
        }
        console.error('Backend error response:', response.status, errorMessage);
        setError(errorMessage);
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err.message || 'An error occurred during checkout');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="checkout-container">
        <div className="checkout-error">
          <h2>Please login to checkout</h2>
          <button onClick={() => navigate('/login')}>Login</button>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="checkout-container">
        <div className="checkout-error">
          <h2>Your cart is empty</h2>
          <button onClick={() => navigate('/products')}>Browse Products</button>
        </div>
      </div>
    );
  }

  // Get user's full name
  const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email?.split('@')[0];

  return (
    <div className="checkout-container">
      <h1>Checkout</h1>
      
      <div className="checkout-content">
        {/* Order Summary */}
        <div className="checkout-summary">
          <h2>Order Summary</h2>
          <div className="summary-items">
            {items.map((item, index) => (
              <div key={item.id || index} className="summary-item">
                <div className="item-image">
                  <img 
                    src={item.product?.imageUrl ? 
                      `http://localhost:8080${item.product.imageUrl}` : 
                      '/images/default-product.jpg'} 
                    alt={item.product?.name}
                  />
                </div>
                <div className="item-details">
                  <h4>{item.product?.name || 'Product'}</h4>
                  <p>Quantity: {item.quantity}</p>
                  <p>${(item.product?.price || 0).toFixed(2)} each</p>
                </div>
                <div className="item-total">
                  ${((item.product?.price || 0) * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
          
          <div className="summary-totals">
            <div className="total-row">
              <span>Subtotal</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <div className="total-row">
              <span>Shipping</span>
              <span>$0.00</span>
            </div>
            <div className="total-row grand-total">
              <span>Total</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Checkout Form - Simplified */}
        <div className="checkout-form">
          <h2>Order Details</h2>
          
          {/* Customer Information */}
          <div className="customer-info-section">
            <h3>Customer Information</h3>
            <div className="customer-details">
              <div className="detail-row">
                <strong>Name:</strong>
                <span>{fullName}</span>
              </div>
              <div className="detail-row">
                <strong>Email:</strong>
                <span>{user.email}</span>
              </div>
              {user.phone && (
                <div className="detail-row">
                  <strong>Phone:</strong>
                  <span>{user.phone}</span>
                </div>
              )}
            </div>
          </div>

          {/* Shipping Address Selection */}
          <div className="shipping-section">
            <h3>Shipping Address</h3>
            
            {fetchingAddresses ? (
              <div className="loading-addresses">Loading addresses...</div>
            ) : userAddresses.length === 0 ? (
              <div className="no-addresses">
                <p>No addresses saved. Please add an address in your profile.</p>
                <button 
                  onClick={() => navigate('/profile')}
                  className="btn-add-address"
                >
                  Add Address
                </button>
              </div>
            ) : (
              <div className="address-selection">
                {userAddresses.map(address => (
                  <div 
                    key={address.id} 
                    className={`address-option ${selectedAddress?.id === address.id ? 'selected' : ''}`}
                    onClick={() => handleAddressSelect(address)}
                  >
                    <div className="address-content">
                      {address.isDefault && <span className="default-badge">⭐ Default</span>}
                      <p className="address-street">{address.street}</p>
                      <p className="address-city">{address.city}, {address.zipCode}</p>
                    </div>
                    <div className="address-radio">
                      <input
                        type="radio"
                        name="selectedAddress"
                        checked={selectedAddress?.id === address.id}
                        onChange={() => handleAddressSelect(address)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <button 
              onClick={() => navigate('/profile')}
              className="btn-manage-addresses"
            >
              Manage Addresses
            </button>
          </div>

          {/* Payment Method */}
          <div className="payment-section">
            <h3>Payment Method</h3>
            <form onSubmit={handleSubmit}>
              <div className="payment-methods">
                <label className="payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="credit-card"
                    checked={formData.paymentMethod === 'credit-card'}
                    onChange={handlePaymentMethodChange}
                  />
                  <div className="payment-option-content">
                    <span className="payment-name">Credit Card</span>
                    <span className="payment-description">Pay with your credit card</span>
                  </div>
                </label>
                
                <label className="payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="paypal"
                    checked={formData.paymentMethod === 'paypal'}
                    onChange={handlePaymentMethodChange}
                  />
                  <div className="payment-option-content">
                    <span className="payment-name">PayPal</span>
                    <span className="payment-description">Pay with your PayPal account</span>
                  </div>
                </label>
                
                <label className="payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === 'cod'}
                    onChange={handlePaymentMethodChange}
                  />
                  <div className="payment-option-content">
                    <span className="payment-name">Cash on Delivery</span>
                    <span className="payment-description">Pay when you receive your order</span>
                  </div>
                </label>
              </div>

              {error && <div className="error-message">{error}</div>}

              <button 
                type="submit" 
                className="place-order-btn"
                disabled={loading || !selectedAddress || userAddresses.length === 0}
              >
                {loading ? 'Processing...' : `Place Order - $${cartTotal.toFixed(2)}`}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;