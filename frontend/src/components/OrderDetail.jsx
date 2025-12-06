import React, { useState, useEffect } from 'react';
import { orderService } from '../services/orderService';
import { api } from '../services/api'; // Assuming you have an api service
import './OrderDetail.css';

const OrderDetail = ({ orderId, onBack }) => {
  const [order, setOrder] = useState(null);
  const [userAddress, setUserAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (orderId) {
      loadOrderAndAddress();
    }
  }, [orderId]);

  const loadOrderAndAddress = async () => {
    try {
      setLoading(true);
      
      // 1. Load the order
      const orderData = await orderService.getOrderById(orderId);
      setOrder(orderData);
      
      console.log('Order data:', orderData);
      console.log('Order has user?', orderData.user);
      console.log('User ID:', orderData.user?.id);
      
      // 2. If order has user info, fetch user address
      if (orderData.user?.id) {
        try {
          // Fetch user's addresses
          const response = await fetch(`http://localhost:8080/api/addresses/user/${orderData.user.id}`);
          if (response.ok) {
            const addresses = await response.json();
            // Find default address or first address
            const defaultAddress = addresses.find(addr => addr.isDefault) || addresses[0];
            setUserAddress(defaultAddress);
            console.log('User address loaded:', defaultAddress);
          }
        } catch (addrError) {
          console.warn('Could not load user address:', addrError);
        }
      }
      
    } catch (err) {
      console.error('Error loading order:', err);
      setError('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  // ... rest of your component code

  // Update the render section for address
  return (
    <div className="order-detail">
      {/* ... other code ... */}
      
      <div className="summary-section">
        <h3>Shipping Address</h3>
        <div className="address-info">
          {userAddress ? (
            <>
              <p><strong>{userAddress.street || ''}</strong></p>
              <p>{userAddress.city || ''}</p>
              <p>{userAddress.zipCode || ''}</p>
              {userAddress.phone && <p>Phone: {userAddress.phone}</p>}
            </>
          ) : (
            <p className="no-info">No shipping address available</p>
          )}
        </div>
      </div>
      
      <div className="summary-section">
        <h3>Payment Information</h3>
        <div className="payment-info">
          {/* If you don't have payment info in Order, you might need to fetch it separately too */}
          <p><strong>Payment Method:</strong> {order?.paymentMethod || 'Cash on Delivery'}</p>
          <p><strong>Payment Status:</strong> {order?.status || 'Pending'}</p>
          <p><strong>Order ID:</strong> {order?.id || 'N/A'}</p>
        </div>
      </div>
      
      {/* ... rest of your code ... */}
    </div>
  );
};

export default OrderDetail;