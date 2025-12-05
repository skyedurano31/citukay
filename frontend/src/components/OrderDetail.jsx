// components/OrderDetail.js
import React, { useState, useEffect } from 'react';
import { orderService } from '../services/orderService';

const OrderDetail = ({ orderId, onBack }) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (orderId) {
      loadOrder();
    }
  }, [orderId]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      const data = await orderService.getOrderById(orderId);
      setOrder(data);
    } catch (err) {
      setError('Failed to load order details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'status-pending';
      case 'processing': return 'status-processing';
      case 'shipped': return 'status-shipped';
      case 'delivered': return 'status-delivered';
      case 'cancelled': return 'status-cancelled';
      default: return 'status-default';
    }
  };

  if (loading) {
    return <div className="loading">Loading order details...</div>;
  }

  if (error || !order) {
    return (
      <div className="error">
        <p>{error || 'Order not found'}</p>
        <button onClick={onBack}>Back to Orders</button>
      </div>
    );
  }

  return (
    <div className="order-detail">
      <button onClick={onBack} className="back-btn">
        ← Back to Orders
      </button>
      
      <div className="order-header-detail">
        <div>
          <h2>Order #{order.id}</h2>
          <p className="order-date">Placed on {formatDate(order.orderDate)}</p>
        </div>
        <div className={`order-status-badge ${getStatusColor(order.status)}`}>
          {order.status}
        </div>
      </div>
      
      <div className="order-content">
        <div className="order-items-detail">
          <h3>Order Items</h3>
          <table className="order-items-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items && order.items.map((item, index) => (
                <tr key={index}>
                  <td>
                    <div className="item-info">
                      <div className="item-image">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt={item.productName} />
                        ) : (
                          <div className="image-placeholder-small">🛒</div>
                        )}
                      </div>
                      <div className="item-details">
                        <div className="item-name">{item.productName}</div>
                        <div className="item-sku">SKU: {item.productId}</div>
                      </div>
                    </div>
                  </td>
                  <td>${item.price?.toFixed(2) || '0.00'}</td>
                  <td>{item.quantity}</td>
                  <td>${(item.price * item.quantity)?.toFixed(2) || '0.00'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="order-summary-detail">
          <div className="summary-section">
            <h3>Order Summary</h3>
            <div className="summary-row total">
              <span>Total</span>
              <span>${order.totalAmount?.toFixed(2) || '0.00'}</span>
            </div>
          </div>
          
          <div className="summary-section">
            <h3>Shipping Address</h3>
            <div className="address-info">
              <p><strong>{order.shippingAddress?.fullName || 'N/A'}</strong></p>
              <p>{order.shippingAddress?.address || ''}</p>
              <p>{order.shippingAddress?.city || ''}</p>
              <p>{order.shippingAddress?.zipCode || ''}</p>
              <p>Phone: {order.shippingAddress?.phone || 'N/A'}</p>
            </div>
          </div>
          
          <div className="summary-section">
            <h3>Payment Information</h3>
            <div className="payment-info">
              <p><strong>Payment Method:</strong> {order.paymentMethod || 'N/A'}</p>
              <p><strong>Payment Status:</strong> {order.paymentStatus || 'N/A'}</p>
              <p><strong>Transaction ID:</strong> {order.transactionId || 'N/A'}</p>
            </div>
          </div>
          
          <div className="summary-section">
            <h3>Order Actions</h3>
            <div className="order-actions">
              <button className="btn-track">Track Order</button>
              <button className="btn-return">Request Return</button>
              <button className="btn-cancel">Cancel Order</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;